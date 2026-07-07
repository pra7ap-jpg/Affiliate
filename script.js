let allProducts = [];

// --- DYNAMIC CONTENT LIBRARY ---
const pages = {
    home: `
        <header class="hero">
            <h1>Premium Gear. <br><span class="highlight">Unbeatable Prices.</span></h1>
        </header>
        <main class="grid-container" id="productsGrid">
            <div class="loading">Fetching the latest deals...</div>
        </main>
    `,
    about: `
        <main class="page-container">
            <h1>About FridayDeals.online</h1>
            <p>Welcome to FridayDeals.online. We are a dedicated curation platform built for consumers who value performance, quality, and rigorous deal verification.</p>
            
            <h2>Our Mission</h2>
            <p>The modern e-commerce landscape is flooded with inflated retail prices, counterfeit discounts, and overwhelming choice paralysis. Our core mission is to cut through the noise. We leverage analytical market tracking to identify genuine price drops and high-quality products across leading retail networks like Amazon and Flipkart.</p>
            
            <h2>How We Operate</h2>
            <p>We do not blindly aggregate data. Every product featured on this platform is selected based on a strict criteria of historical pricing data, brand reputation, and consumer utility. If a deal does not represent true market value, it does not make it to our grid.</p>

            <h2>The Affiliate Model (Full Transparency)</h2>
            <p>Running a high-performance aggregation platform requires resources. To sustain our operations and keep this service entirely free for you, we utilize an affiliate marketing model.</p>
            <p><strong>What this means:</strong> When you click on a product link on FridayDeals.online and make a purchase, the retailer pays us a small percentage of the sale as a referral fee. <strong>This commission is paid out of the retailer's margin. It does not increase the price you pay by a single cent.</strong></p>
            <p>Our editorial integrity remains unaffected by affiliate partnerships. We list products because they are excellent deals, not merely because they yield a commission.</p>
        </main>
    `,
    privacy: `
        <main class="page-container">
            <h1>Privacy Policy</h1>
            <p><em>Last Updated: July 2026</em></p>
            <p>At FridayDeals.online, we are committed to safeguarding your privacy. This comprehensive policy outlines how we handle data when you utilize our platform.</p>
            
            <h2>1. Data Collection and Usage</h2>
            <p>We believe in minimal data collection. We do not require account creation, and we do not collect personally identifiable information (PII) such as names, addresses, or payment details, as we do not process transactions directly.</p>
            <p><strong>Log Data & Analytics:</strong> Like most standard websites, our servers automatically record basic log data. This includes your IP address, browser type, device specifications, referring/exit pages, and timestamps. This data is strictly used for security monitoring and aggregate site performance analysis.</p>

            <h2>2. Cookies and Tracking Technologies</h2>
            <p>We use cookies (small text files stored on your device) to enhance user experience and facilitate our affiliate tracking.</p>
            <ul>
                <li><strong>Affiliate Cookies:</strong> When you click an outbound link to a retailer (e.g., Amazon), an affiliate cookie is placed on your browser. This cookie informs the retailer that FridayDeals referred you, allowing us to earn our commission if you make a purchase within a specified timeframe (typically 24 hours).</li>
                <li><strong>Functional Cookies:</strong> Used to remember your site preferences (like search filters) during your session.</li>
            </ul>
            <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, doing so may impact certain functionalities of the site.</p>

            <h2>3. Third-Party Links and Policies</h2>
            <p>Our primary function is directing you to external e-commerce sites. Once you leave FridayDeals.online, our Privacy Policy no longer applies. We strongly advise reviewing the privacy policies of any third-party retailer before providing them with your payment or shipping information.</p>

            <h2>4. Data Security</h2>
            <p>We implement robust, industry-standard security measures (including SSL encryption) to protect the integrity of our platform. However, no method of transmission over the internet is 100% secure.</p>
        </main>
    `,
    terms: `
        <main class="page-container">
            <h1>Terms & Conditions</h1>
            <p><em>Effective Date: July 2026</em></p>
            <p>By accessing and utilizing FridayDeals.online, you agree to be bound by the following comprehensive Terms and Conditions.</p>
            
            <h2>1. Platform Function and Scope</h2>
            <p>FridayDeals.online operates exclusively as a curation and referral platform. We are not a retailer, distributor, or manufacturer. We do not hold inventory, process payments, or manage order fulfillment.</p>

            <h2>2. Accuracy of Information and Pricing</h2>
            <p>We continuously monitor and update our data feeds. However, e-commerce pricing is highly volatile. The prices, discounts, and availability displayed on our platform are accurate at the time of publication but are subject to immediate change by the third-party retailer.</p>
            <p><strong>The final price you pay is the price displayed on the retailer's checkout page.</strong> We hold no liability for discrepancies between the price listed on FridayDeals and the final checkout price.</p>

            <h2>3. Affiliate Disclosure and Endorsements</h2>
            <p>In compliance with FTC guidelines and global digital marketing standards, we declare that links pointing to external retailers are affiliate links. While we curate products based on perceived value, inclusion on this site does not constitute a legally binding warranty or guarantee of the product's performance.</p>

            <h2>4. Limitation of Liability</h2>
            <p>Under no circumstances shall FridayDeals.online, its operators, or affiliates be held liable for any direct, indirect, incidental, or consequential damages arising from:</p>
            <ul>
                <li>The use or inability to use our platform.</li>
                <li>Defective merchandise purchased from third-party retailers via our links.</li>
                <li>Shipping delays, return disputes, or customer service issues with the end retailer.</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>The underlying code, original UI/UX design, and unique curation structures of FridayDeals.online are our intellectual property. Brand names, logos, and product imagery (such as those of Amazon and Flipkart) remain the intellectual property of their respective trademark holders and are used under fair use for identification purposes.</p>

            <h2>6. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts in Bihar, India.</p>
        </main>
    `,
    contact: `
        <main class="page-container">
            <h1>Contact Us</h1>
            <p>We value clear and efficient communication. Whether you are a user with feedback or a brand looking to establish a performance partnership, here is how you can reach us.</p>
            
            <h2>Partnerships & Advertising</h2>
            <p>For brands, aggregators, and PR agencies: We are open to reviewing products, hosting sponsored placements, and establishing direct CPA/CPS partnerships provided the offers align with our audience's expectations for high value.</p>
            <p>Email: <strong>partnerships@fridaydeals.online</strong></p>

            <h2>General Inquiries & Bug Reports</h2>
            <p>If you encounter a broken link, a technical glitch on the site, or have a suggestion for a product category we should cover, let us know.</p>
            <p>Email: <strong>support@fridaydeals.online</strong></p>
            
            <hr style="margin: 40px 0; border: 1px solid #e2e8f0;">

            <h2>⚠️ Important Customer Service Notice</h2>
            <p>Please note that FridayDeals.online is a deal discovery engine. <strong>We do not sell products directly.</strong> If you have an issue regarding:</p>
            <ul>
                <li>Order tracking or delivery status</li>
                <li>Refunds or product returns</li>
                <li>Warranty claims</li>
            </ul>
            <p>You must contact the customer service department of the retailer where the transaction took place (e.g., Amazon Support or Flipkart Support). We do not have access to your order history or payment data.</p>
        </main>
    `
};

// --- ROUTER LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    handleRouting();
    
    // Listen for hash changes (when a user clicks a link)
    window.addEventListener('hashchange', handleRouting);
});

function handleRouting() {
    const appRoot = document.getElementById('app-root');
    const searchInput = document.getElementById('searchInput');
    let hash = window.location.hash.substring(1); // Remove the '#'
    
    // Default to home if no hash or invalid hash
    if (!hash || !pages[hash]) {
        hash = 'home';
    }

    // Inject the HTML for the current page
    appRoot.innerHTML = pages[hash];
    window.scrollTo(0, 0);

    // If we are on the home page, we need to fetch and render the products
    if (hash === 'home') {
        searchInput.style.display = 'block'; // Show search bar
        
        if (allProducts.length === 0) {
            fetchDeals(); // Fetch from Vercel API only if not fetched yet
        } else {
            renderProducts(allProducts); // Render immediately if data exists
        }

        // Re-attach search listener since the DOM changed
        searchInput.addEventListener('input', handleSearch);
    } else {
        // Hide search bar on legal pages
        searchInput.style.display = 'none';
    }
}

// --- DATA FETCHING & RENDERING ---
function fetchDeals() {
    fetch('/api/deals')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    allProducts = results.data;
                    renderProducts(allProducts);
                }
            });
        })
        .catch(err => {
            const grid = document.getElementById('productsGrid');
            if(grid) grid.innerHTML = '<div class="loading">Failed to load deals.</div>';
        });
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return; // Prevent errors if user navigates away before load finishes

    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">No products found.</div>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${product.ImageURL || ''}" alt="${product.Title || 'Product Image'}">
            </div>
            <div class="card-content">
                <div class="card-category">${product.Platform || 'Deal'}</div>
                <h3 class="card-title">${product.Title || 'Untitled Product'}</h3>
                <div class="card-footer">
                    <div class="price-tag">${product.Price || ''}</div>
                    <a href="${product.AffiliateLink || '#'}" target="_blank" class="btn">Grab Deal</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => {
        const title = p.Title ? p.Title.toLowerCase() : '';
        const category = p.Category ? p.Category.toLowerCase() : '';
        return title.includes(term) || category.includes(term);
    });
    renderProducts(filtered);
}
