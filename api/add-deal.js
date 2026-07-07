export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    let { productUrl, category } = req.body;
    
    const SCRAPER_API_KEY = '6455cbfb43dbb193447b5d8ae4ca31e4'; 
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyudKVJfTqmFZ7Pr33X6sWAvMhYuETeD7l_Gmz3z79dz8iSUzMp_-WTHNg1EPLiTgi8/exec';
    const YOUR_AMAZON_AFFILIATE_TAG = 'fridaydeals-21'; 

    try {
        // Expand shortened links (like amzn.to or amzn.in) before checking
        if (productUrl.includes('amzn.to') || productUrl.includes('amzn.in')) {
            const redirectRes = await fetch(productUrl, { method: 'HEAD', redirect: 'manual' });
            if (redirectRes.status >= 300 && redirectRes.status < 400) {
                productUrl = redirectRes.headers.get('location') || productUrl;
            }
        }

        // Broader regex to catch the ASIN in various Amazon URL structures
        const asinMatch = productUrl.match(/(?:dp|gp\/product|product|asin)\/?([A-Z0-9]{10})/i);
        
        if (!asinMatch) {
            return res.status(400).json({ error: 'Could not extract ASIN. Please paste the full product URL from your browser.' });
        }
        
        const asin = asinMatch[1].toUpperCase();
        const targetAmazonUrl = `https://www.amazon.in/dp/${asin}`;

        // Scrape the clean URL
        const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&autoparse=true&url=${encodeURIComponent(targetAmazonUrl)}`;
        const scraperRes = await fetch(scraperUrl);
        const product = await scraperRes.json();

        // Format and push to Google Sheets
        const payload = {
            title: product.name || product.title || 'Untitled Product',
            category: category || 'Deals',
            price: product.pricing || product.price || '',
            oldPrice: product.list_price || product.rrp || '',
            image: (product.images && product.images[0]) ? product.images[0] : '',
            link: `${targetAmazonUrl}?tag=${YOUR_AMAZON_AFFILIATE_TAG}`,
            platform: 'Amazon'
        };

        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        res.status(200).json({ success: true, message: 'Deal successfully pushed to sheet!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the link. Scraper timeout or bad link.' });
    }
}
