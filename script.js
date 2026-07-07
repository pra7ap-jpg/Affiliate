let allProducts = [];
let activeCategory = 'All';
let currentSearchTerm = '';

// --- DYNAMIC CONTENT LIBRARY ---
const pages = {
    home: `
        <header class="hero">
            <h1>Premium Gear. <br><span class="highlight">Unbeatable Prices.</span></h1>
        </header>

        <section class="info-section">
            <div class="info-box">
                <h3>⚡ Live Updates</h3>
                <p>Prices and stock status are tracked and updated dynamically.</p>
            </div>
            <div class="info-box highlight-box">
                <h3>🤝 Affiliate Disclosure</h3>
                <p>We earn a small commission from retailers if you buy through our links, at zero extra cost to you.</p>
            </div>
            <div class="info-box">
                <h3>🛡️ Verified Deals</h3>
                <p>We filter out fake discounts so you only see genuine price drops.</p>
            </div>
        </section>

        <div id="categoryFilters" class="filter-container"></div>
        <main class="grid-container" id="productsGrid">
            <div class="loading" style="grid-column: 1/-1; text-align: center; font-weight: 800; padding: 40px; font-size: 1.1rem;">Fetching the latest deals...</div>
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
        </main>
    `,
    privacy: `
        <main class="page-container">
            <h1>Privacy Policy</h1>
            <p><em>Last Updated: July 2026</em></p>
            <p>At FridayDeals.online, we are committed to safeguarding your privacy. This comprehensive policy outlines how we handle data when you utilize our platform.</p>
            <h2>1. Data Collection and Usage</h2>
            <p>We believe in minimal data collection. We do not require account creation, and we do not collect personally identifiable information (PII) such as names, addresses, or payment details, as we do not process transactions directly.</p>
            <h2>2. Cookies and Tracking Technologies</h2>
            <p>We use cookies to enhance user experience and facilitate our affiliate tracking. When you click an outbound link to a retailer, an affiliate cookie is placed on your browser. This cookie informs the retailer that FridayDeals referred you.</p>
            <h2>3. Third-Party Links</h2>
            <p>Our primary function is directing you to external e-commerce sites. Once you leave FridayDeals.online, our Privacy Policy no longer applies.</p>
        </main>
    `,
    terms: `
        <main class="page-container">
            <h1>Terms & Conditions</h1>
            <p><em>Effective Date: July 2026</em></p>
            <h2>1. Platform Function and Scope</h2>
            <p>FridayDeals.online operates exclusively as a curation and referral platform. We are not a retailer, distributor, or manufacturer. We do not hold inventory, process payments, or manage order fulfillment.</p>
            <h2>2. Accuracy of Information and Pricing</h2>
            <p>We continuously monitor and update our data feeds. However, e-commerce pricing is highly volatile. <strong>The final price you pay is the price displayed on the retailer's checkout page.</strong></p>
            <h2>3. Affiliate Disclosure</h2>
            <p>In compliance with standard guidelines, we declare that links pointing to external retailers are affiliate links.</p>
        </main>
    `,
    contact: `
        <main class="page-container">
            <h1>Contact Us</h1>
            <p>We value clear and efficient communication. Whether you are a user with feedback or a brand looking to establish a performance partnership, here is how you can reach us.</p>
            <h2>Partnerships & Advertising</h2>
            <p>Email: <strong>partnerships@fridaydeals.online</strong></p>
            <h2>General Inquiries & Bug Reports</h2>
            <p>Email: <strong>support@fridaydeals.online</strong></p>
            <hr style="border: 1px solid #111; margin: 40px 0;">
            <h2>⚠️ Important Customer Service Notice</h2>
            <p>Please note that FridayDeals.online is a deal discovery engine. <strong>We do not sell products directly.</strong> If you have an issue regarding order tracking, refunds, or returns, you must contact the retailer where the transaction took place.</p>
        </main>
    `
};

// --- ROUTER LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
});

function handleRouting() {
    const appRoot = document.getElementById('app-root');
    const searchInput = document.getElementById('searchInput');
    let hash = window.location.hash.substring(1);
    
    if (!hash || !pages[hash]) { hash = 'home'; }

    appRoot.innerHTML = pages[hash];
    window.scrollTo(0, 0);

    if (hash === 'home') {
        searchInput.style.display = 'block';
        
        if (allProducts.length === 0) {
            fetchDeals();
        } else {
            renderFilters();
            applyFilters();
        }
        searchInput.addEventListener('input', handleSearch);
    } else {
        searchInput.style.display = 'none';
        searchInput.removeEventListener('input', handleSearch);
    }
}

// --- DATA FETCHING & FILTERING ---
function fetchDeals() {
    const freshUrl = '/api/deals?t=' + Date.now();
    
    fetch(freshUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    allProducts = results.data.reverse(); 
                    
                    if (window.location.hash === '' || window.location.hash === '#home') {
                        renderFilters();
                        applyFilters();
                    }
                }
            });
        })
        .catch(err => {
            console.error("Error fetching deals:", err);
            const grid = document.getElementById('productsGrid');
            if(grid) grid.innerHTML = '<div style="color: #111; grid-column: 1/-1; text-align: center; padding: 40px; font-weight: 800;">Failed to load deals.</div>';
        });
}

function renderFilters() {
    const filterContainer = document.getElementById('categoryFilters');
    if (!filterContainer) return;

    const categories = ['All', ...new Set(allProducts.map(p => p.Category || p.category).filter(Boolean))];
    
    filterContainer.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${activeCategory === cat ? 'active' : ''}" onclick="setCategory('${cat}')">${cat}</button>`
    ).join('');
}

function setCategory(category) {
    activeCategory = category;
    renderFilters();
    applyFilters();
}

function handleSearch(e) {
    currentSearchTerm = e.target.value.toLowerCase();
    applyFilters();
}

function applyFilters() {
    let filtered = allProducts;
    
    if (activeCategory !== 'All') {
        filtered = filtered.filter(p => (p.Category || p.category) === activeCategory);
    }
    
    if (currentSearchTerm) {
        filtered = filtered.filter(p => {
            const title = (p.Title || p.title || '').toLowerCase();
            return title.includes(currentSearchTerm);
        });
    }
    
    renderProducts(filtered);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div style="color: #111; grid-column: 1 / -1; text-align: center; padding: 40px 0; font-weight: 800;">No deals found matching your search.</div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const title = product.Title || product.title || 'Deal of the Day';
        const price = product.Price || product.price || '';
        const oldPrice = product.OldPrice || product.oldPrice || '';
        const img = product.ImageURL || product.image || '';
        const link = product.AffiliateLink || product.link || '#';

        return `
            <div class="product-card">
                <img src="${img}" alt="${title}" loading="lazy">
                <div class="product-info">
                    <h3>${title}</h3>
                    <div class="price-row">
                        <span class="price">${price}</span>
                        <span class="old-price">${oldPrice}</span>
                    </div>
                    <a href="${link}" target="_blank" class="buy-btn">Grab Deal</a>
                </div>
            </div>
        `;
    }).join('');
}
