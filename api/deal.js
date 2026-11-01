// Serves a shareable per-product page at fridaydeals.online/deal/<ASIN>
// (routed here by vercel.json). The page carries Open Graph tags so shares on
// Telegram / Facebook / WhatsApp show the product photo and details, while the
// visible link stays on fridaydeals.online.

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGy1ecJ96nFNxjc-PvOY4RC3HhwC8AYYTLG9MKUaTBgudoFLKgg5odzFMgMWA5-CIaNHIfXynI8kxq/pub?gid=0&single=true&output=csv';

function parseCSV(text) {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else field += c;
        } else if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n' || c === '\r') {
            if (c === '\r' && text[i + 1] === '\n') i++;
            row.push(field); field = '';
            if (row.length > 1 || row[0] !== '') rows.push(row);
            row = [];
        } else field += c;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
}

function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function num(s) {
    const n = parseFloat(String(s || '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
}

export default async function handler(req, res) {
    const asin = String(req.query.asin || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!asin) { res.status(400).send('Missing product id'); return; }

    let product = null;
    try {
        const response = await fetch(SHEET_URL);
        const csv = await response.text();
        const rows = parseCSV(csv);
        const header = rows[0].map(h => h.trim().toLowerCase());
        const idx = {
            title: header.indexOf('title'),
            category: header.indexOf('category'),
            price: header.indexOf('price'),
            old: header.indexOf('oldprice'),
            img: header.indexOf('imageurl'),
            link: header.indexOf('affiliatelink')
        };
        for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            const link = r[idx.link] || '';
            if (link.toUpperCase().includes(`/DP/${asin}`)) {
                product = {
                    title: r[idx.title] || 'Deal',
                    category: r[idx.category] || '',
                    price: r[idx.price] || '',
                    oldPrice: r[idx.old] || '',
                    img: r[idx.img] || '',
                    link
                };
                break;
            }
        }
    } catch (e) {
        res.status(500).send('Could not load this deal right now. Please try again.');
        return;
    }

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (!product) {
        res.status(404).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Deal not found | FridayDeals</title></head><body style="font-family:sans-serif;text-align:center;padding:60px 20px;"><h1>This deal is no longer listed</h1><p>It may have sold out or been replaced by a better price.</p><p><a href="https://fridaydeals.online/">See all current deals on FridayDeals →</a></p></body></html>`);
        return;
    }

    const pageUrl = `https://fridaydeals.online/deal/${asin}`;
    const priceNum = num(product.price), oldNum = num(product.oldPrice);
    const discount = (oldNum > priceNum && priceNum > 0) ? Math.round((1 - priceNum / oldNum) * 100) : 0;
    const description = `${product.title} — now ${product.price}${product.oldPrice ? ` (was ${product.oldPrice})` : ''}${discount ? `, ${discount}% off` : ''}. Handpicked and price-checked by FridayDeals. Tap to view it on Amazon.`;

    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(product.title)} | FridayDeals</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="FridayDeals">
<meta property="og:url" content="${pageUrl}">
<meta property="og:title" content="${esc(product.title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(product.img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(product.title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(product.img)}">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Plus Jakarta Sans',sans-serif; background:#fffaf1; color:#0f172a; }
    .bar { background:linear-gradient(90deg,#7f1d1d,#b45309 50%,#7f1d1d); color:#fde68a; text-align:center; font-size:.8rem; font-weight:700; letter-spacing:.4px; padding:8px 12px; }
    header { background:#fff; border-bottom:1px solid #f1e6cf; padding:14px 20px; text-align:center; }
    header a { color:#0f172a; text-decoration:none; font-size:1.4rem; font-weight:800; letter-spacing:-.5px; }
    header .gold { background:linear-gradient(120deg,#b45309,#f59e0b); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .card { max-width:560px; margin:28px auto 40px; background:#fff; border:1px solid #f1e6cf; border-radius:24px; padding:24px; box-shadow:0 12px 30px rgba(180,83,9,.10); width:calc(100% - 32px); }
    .card img { width:100%; height:300px; object-fit:contain; background:#fdf9ef; border-radius:16px; padding:16px; }
    .off { display:inline-block; background:#16a34a; color:#fff; font-weight:800; font-size:.78rem; padding:5px 10px; border-radius:999px; margin:16px 0 8px; }
    h1 { font-size:1.25rem; line-height:1.45; font-weight:800; }
    .cat { color:#b45309; font-weight:700; font-size:.85rem; margin-top:6px; }
    .prices { display:flex; align-items:baseline; gap:12px; margin:16px 0 20px; }
    .price { font-size:2rem; font-weight:800; }
    .old { color:#64748b; text-decoration:line-through; font-weight:600; }
    .buy { display:block; text-align:center; background:linear-gradient(180deg,#ffcf3f,#ffb800); color:#111; font-weight:800; font-size:1.05rem; padding:16px; border-radius:14px; text-decoration:none; box-shadow:0 4px 0 #b96a00, 0 12px 20px rgba(255,153,0,.35); }
    .buy:active { transform:translateY(3px); box-shadow:0 1px 0 #b96a00; }
    .more { display:block; text-align:center; margin-top:16px; color:#2563eb; font-weight:700; text-decoration:none; }
    .note { max-width:560px; margin:0 auto 40px; width:calc(100% - 32px); font-size:.8rem; color:#64748b; line-height:1.6; text-align:center; }
</style>
</head>
<body>
<div class="bar">✦ DIWALI SALE IS LIVE ✦</div>
<header><a href="https://fridaydeals.online/">Friday<span class="gold">Deals</span></a></header>
<main class="card">
    <img src="${esc(product.img)}" alt="${esc(product.title)}">
    ${discount ? `<span class="off">${discount}% OFF</span>` : ''}
    <h1>${esc(product.title)}</h1>
    ${product.category ? `<div class="cat">${esc(product.category)}</div>` : ''}
    <div class="prices"><span class="price">${esc(product.price)}</span>${product.oldPrice ? `<span class="old">${esc(product.oldPrice)}</span>` : ''}</div>
    <a class="buy" href="${esc(product.link)}" target="_blank" rel="noopener noreferrer">View on Amazon ↗</a>
    <a class="more" href="https://fridaydeals.online/">See all deals on FridayDeals →</a>
</main>
<p class="note">Prices are checked when the deal is listed, but Amazon can change them at any time — the final price on Amazon's checkout page is the one that counts. FridayDeals may earn a small commission from purchases made through its links, at no extra cost to you.</p>
</body>
</html>`);
}
