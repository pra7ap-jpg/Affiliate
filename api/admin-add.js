// Secure admin endpoint for FridayDeals.
// The admin page (fnsoano.html) holds NO secrets: it sends the password the
// user typed plus one product URL (or manual details) here, and everything
// sensitive happens server-side using Vercel environment variables:
//   ADMIN_PASSWORD     - the admin login password (never in the repo)
//   SCRAPER_API_KEY    - ScraperAPI key used to fetch product data
//   SHEET_WEBHOOK_URL  - Google Apps Script webhook that appends to the Sheet
//   SHEET_WEBHOOK_TOKEN- optional shared token, forwarded to the webhook so a
//                        hardened Apps Script can reject direct spam posts
import { timingSafeEqual } from 'crypto';

const TAG = 'affindi-21';

// Best-effort brute-force throttle (per warm instance): after 8 failed
// password attempts from one IP, lock that IP out for 15 minutes.
const fails = new Map();
function lockedOut(ip) {
    const f = fails.get(ip);
    return f && f.count >= 8 && Date.now() - f.last < 15 * 60 * 1000;
}
function noteFail(ip) {
    const f = fails.get(ip) || { count: 0, last: 0 };
    f.count++; f.last = Date.now();
    fails.set(ip, f);
}

function passwordOk(given) {
    const expected = process.env.ADMIN_PASSWORD || '';
    if (!expected || typeof given !== 'string') return false;
    const a = Buffer.from(given), b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
}

function sanitizeURL(rawUrl) {
    let url = String(rawUrl || '').trim();
    if (url.includes('amazon') || url.includes('amzn')) {
        if (url.includes('amzn.to') || url.includes('amzn.in')) return url;
        const m = url.match(/\/dp\/([A-Z0-9]{10})/i);
        if (m) return `https://www.amazon.in/dp/${m[1].toUpperCase()}`;
    }
    return url.split('?')[0];
}

async function pushToSheet(payload) {
    const webhook = process.env.SHEET_WEBHOOK_URL;
    if (!webhook) throw new Error('Server is missing SHEET_WEBHOOK_URL');
    if (process.env.SHEET_WEBHOOK_TOKEN) payload.Token = process.env.SHEET_WEBHOOK_TOKEN;
    await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    if (lockedOut(ip)) { res.status(429).json({ error: 'Too many wrong attempts. Try again in 15 minutes.' }); return; }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};

    if (!passwordOk(body.password)) {
        noteFail(ip);
        res.status(401).json({ error: 'Invalid password' });
        return;
    }

    // Login check only (used by the admin page when the user taps Login)
    if (body.ping) { res.status(200).json({ ok: true }); return; }

    const category = String(body.category || 'Miscellaneous').slice(0, 60);

    try {
        // Manual entry fallback (scrape failed in the browser flow)
        if (body.manual) {
            const cleanUrl = sanitizeURL(body.url || '');
            if (!cleanUrl) { res.status(400).json({ error: 'Missing product URL' }); return; }
            let link = cleanUrl;
            if (cleanUrl.includes('amazon') || cleanUrl.includes('amzn')) link = `${cleanUrl}?tag=${TAG}`;
            const payload = {
                Title: String(body.manual.Title || '').slice(0, 300),
                Category: category,
                Price: String(body.manual.Price || '').slice(0, 30),
                OldPrice: '',
                ImageURL: String(body.manual.ImageURL || '').slice(0, 500),
                AffiliateLink: link,
            };
            if (!payload.Title || !payload.Price) { res.status(400).json({ error: 'Title and Price are required' }); return; }
            if (!body.dryRun) await pushToSheet(payload);
            res.status(200).json({ ok: true, payload });
            return;
        }

        // Normal flow: scrape one product URL, then append it to the Sheet
        const originalUrl = String(body.url || '');
        const cleanUrl = sanitizeURL(originalUrl);
        if (!cleanUrl) { res.status(400).json({ error: 'Missing product URL' }); return; }
        if (!/amazon|amzn|flipkart|fkrt|myntra/i.test(cleanUrl)) {
            res.status(400).json({ error: 'Unsupported platform' });
            return;
        }

        let link = cleanUrl;
        if (cleanUrl.includes('amazon') || cleanUrl.includes('amzn')) {
            link = originalUrl.includes('tag=') ? originalUrl : `${cleanUrl}?tag=${TAG}`;
        }

        const key = process.env.SCRAPER_API_KEY;
        if (!key) { res.status(500).json({ error: 'Server is missing SCRAPER_API_KEY' }); return; }
        const scraperUrl = `https://api.scraperapi.com/?api_key=${key}&autoparse=true&premium=true&url=${encodeURIComponent(cleanUrl)}`;
        const sres = await fetch(scraperUrl);
        const raw = await sres.text();
        let data;
        try { data = JSON.parse(raw); } catch { res.status(502).json({ error: 'Scraper blocked (CAPTCHA). Try the manual entry.' }); return; }
        if (data.error) { res.status(502).json({ error: String(data.error) }); return; }
        if (!data.name && !data.title) { res.status(502).json({ error: 'No product data found. Try the manual entry.' }); return; }

        const payload = {
            Title: data.name || data.title,
            Category: category,
            Price: data.pricing || data.price || '',
            OldPrice: data.list_price || data.rrp || '',
            ImageURL: (data.images && data.images[0]) ? data.images[0] : '',
            AffiliateLink: link,
        };
        if (!payload.Price) { res.status(502).json({ error: 'No price found (product may be out of stock).' }); return; }
        if (!payload.ImageURL) { res.status(502).json({ error: 'No product image found.' }); return; }

        if (!body.dryRun) await pushToSheet(payload);
        res.status(200).json({ ok: true, payload });
    } catch (e) {
        res.status(500).json({ error: 'Server error: ' + e.message });
    }
}
