export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { productUrl, category } = req.body;
    
    // PASTE YOUR KEYS HERE
    const RAINFOREST_API_KEY = 'YOUR_RAINFOREST_API_KEY'; 
    const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
    const YOUR_AMAZON_AFFILIATE_TAG = 'fridaydeals-21'; // Replace with yours

    // Extract the 10-character ASIN from the Amazon URL
    const asinMatch = productUrl.match(/(?:dp|o|v|a|aw)\/([A-Z0-9]{10})/);
    if (!asinMatch) return res.status(400).json({ error: 'Invalid Amazon URL. Need an ASIN.' });
    const asin = asinMatch[1];

    try {
        // 1. Fetch data from Amazon via Rainforest API
        const rfRes = await fetch(`https://api.rainforestapi.com/request?api_key=${RAINFOREST_API_KEY}&type=product&amazon_domain=amazon.in&asin=${asin}`);
        const rfData = await rfRes.json();

        const product = rfData.product;
        
        // 2. Format the payload
        const payload = {
            title: product.title,
            category: category || 'Deals',
            price: product.buybox_winner?.price?.raw || '',
            oldPrice: product.buybox_winner?.rrp?.raw || '',
            image: product.main_image?.link || '',
            link: `https://www.amazon.in/dp/${asin}?tag=${YOUR_AMAZON_AFFILIATE_TAG}`,
            platform: 'Amazon'
        };

        // 3. Send the data to your Google Sheet
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        res.status(200).json({ success: true, message: 'Deal added to sheet!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process the link.' });
    }
}
