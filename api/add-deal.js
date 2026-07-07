export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { productUrl, category } = req.body;
    
    // Your actual keys
    const SCRAPER_API_KEY = '6455cbfb43dbb193447b5d8ae4ca31e4'; 
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyudKVJfTqmFZ7Pr33X6sWAvMhYuETeD7l_Gmz3z79dz8iSUzMp_-WTHNg1EPLiTgi8/exec';
    
    // Remember to replace this with your actual Amazon Associates tracking ID later
    const YOUR_AMAZON_AFFILIATE_TAG = 'fridaydeals-21'; 

    // Extract the 10-character ASIN from the raw Amazon URL
    const asinMatch = productUrl.match(/(?:dp|o|v|a|aw)\/([A-Z0-9]{10})/);
    if (!asinMatch) return res.status(400).json({ error: 'Invalid Amazon URL. Make sure it contains an ASIN.' });
    
    const asin = asinMatch[1];
    const targetAmazonUrl = `https://www.amazon.in/dp/${asin}`;

    try {
        // 1. Fetch data from Amazon via ScraperAPI (autoparse=true forces a clean JSON response)
        const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&autoparse=true&url=${encodeURIComponent(targetAmazonUrl)}`;
        const scraperRes = await fetch(scraperUrl);
        const product = await scraperRes.json();

        // 2. Format the payload using ScraperAPI's JSON structure
        const payload = {
            title: product.name || product.title || 'Untitled Product',
            category: category || 'Deals',
            price: product.pricing || product.price || '',
            oldPrice: product.list_price || product.rrp || '',
            image: (product.images && product.images[0]) ? product.images[0] : '',
            link: `${targetAmazonUrl}?tag=${YOUR_AMAZON_AFFILIATE_TAG}`,
            platform: 'Amazon'
        };

        // 3. Send the formatted data straight to your Google Sheet
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        res.status(200).json({ success: true, message: 'Deal successfully pushed to sheet!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the link. The scraper might have timed out.' });
    }
}
