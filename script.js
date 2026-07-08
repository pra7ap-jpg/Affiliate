let allProducts = [];
let activeCategory = 'All';
let currentSearchTerm = '';

// --- HAMBURGER MENU & DRAWER LOGIC ---
const menuToggle = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');

function toggleDrawer() {
    menuToggle.classList.toggle('active');
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleDrawer);
overlay.addEventListener('click', toggleDrawer);

// --- DYNAMIC CONTENT LIBRARY ---
const pages = {
    home: `
        <section class="trust-banner">
            <h1>Curated. Verified. Unbeatable.</h1>
            <div class="trust-grid">
                <div class="trust-card">
                    <h3>🛡️ Strict Verification</h3>
                    <p>Every deal is analyzed against historical pricing data to ensure the discount is genuine.</p>
                </div>
                <div class="trust-card">
                    <h3>⚡ Direct to Retailer</h3>
                    <p>No middlemen. Clicking a deal takes you straight to the official Amazon or Flipkart product page.</p>
                </div>
                <div class="trust-card">
                    <h3>🎯 Quality Filtered</h3>
                    <p>We bypass the junk and only curate products with high consumer utility and brand reputation.</p>
                </div>
            </div>
        </section>

        <main class="grid-container" id="productsGrid">
            <div style="grid-column: 1/-1; text-align: center; font-weight: 600; padding: 60px; font-size: 1.1rem; color: #64748b;">
                Hunting the latest deals...
            </div>
        </main>

        <section class="full-disclosure">
            <h2>Affiliate Transparency</h2>
            <p><strong>Operational Model:</strong> FridayDeals is a reader-supported curation engine. Outbound clicks resulting in a purchase may generate a referral commission.</p>
            <p><strong>Consumer Impact:</strong> The commission is levied entirely on the retailer's margin. The checkout price remains fundamentally identical whether routed through our tracking link or accessed independently.</p>
            <p>We maintain independent operational control. Sponsored artificial deal placement is strictly prohibited.</p>
        </section>
    `,
    
    about: `
        <main class="page-container">
            <h1>About FridayDeals</h1>
            <p>Welcome to FridayDeals.online. We are a performance-driven curation platform engineered for consumers who demand quality, value, and total transparency in their online shopping.</p>
            
            <h2>The Problem We Are Solving</h2>
            <p>The modern e-commerce landscape is broken. It is flooded with artificially inflated retail prices, countdown timers designed to cause panic, and counterfeit "discounts" where a price is raised one day only to be "slashed" the next. Consumers are experiencing intense choice paralysis and discount fatigue.</p>
            
            <h2>Our Data-Driven Solution</h2>
            <p>Our core mission is to cut through the algorithmic noise. We leverage analytical market tracking to identify genuine price drops across leading retail networks like Amazon and Flipkart. We do not blindly scrape and dump data.</p>
            <p>Every product featured on our grid is subjected to strict criteria:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px; color: var(--text-muted); font-weight: 500;">
                <li style="margin-bottom: 8px;"><strong>Historical Pricing Validation:</strong> Is this actually the lowest price in the last 90 days?</li>
                <li style="margin-bottom: 8px;"><strong>Brand Reputation:</strong> Does this product have a legitimate track record of reliability?</li>
                <li style="margin-bottom: 8px;"><strong>Consumer Utility:</strong> Is this an item our users actually need or want?</li>
            </ul>
            <p>If a deal does not represent true market value, it does not make it to our platform. Period.</p>

            <h2>How We Sustain Operations</h2>
            <p>Building and maintaining a high-speed aggregation tool requires resources. To keep this service entirely free and free of obtrusive display ads, we operate on an affiliate marketing model. When you click a deal and make a purchase, the retailer pays us a small performance commission out of their own margin. It costs you absolutely nothing extra.</p>
        </main>
    `,
    
    privacy: `
        <main class="page-container">
            <h1>Privacy Policy</h1>
            <p><em>Effective Date: July 2026</em></p>
            <p>At FridayDeals.online, we believe your data is yours. We have engineered our platform to function on a principle of absolute minimal data collection. This document outlines exactly what information we handle, how we use it, and how we protect it.</p>
            
            <h2>1. Information We Do Not Collect</h2>
            <p>We are a discovery engine, not a retailer. Therefore, we deliberately design our systems to avoid collecting sensitive data:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px; color: var(--text-muted); font-weight: 500;">
                <li style="margin-bottom: 8px;">We do not require account registration or logins.</li>
                <li style="margin-bottom: 8px;">We do not collect Personally Identifiable Information (PII) such as your name, home address, or phone number.</li>
                <li style="margin-bottom: 8px;">We do not ask for, process, or store credit card numbers or financial data under any circumstances.</li>
            </ul>

            <h2>2. Cookies & Affiliate Tracking Technologies</h2>
            <p>To sustain our operations, we utilize performance marketing tracking links. When you click an outbound link to a merchant (e.g., Amazon, Flipkart), a temporary affiliate cookie is placed on your browser. This cookie contains a unique, anonymous identifier that simply tells the retailer that FridayDeals.online referred you. This allows us to earn a commission if you make a purchase.</p>

            <h2>3. Third-Party Websites and Analytics</h2>
            <p>Our platform contains links to external retail sites. Once you click a deal and leave FridayDeals.online, you are subject to the privacy policies and terms of that specific retailer. We recommend reviewing the privacy protocols of any site you visit.</p>
            <p>We may also use standard analytics tools (like Google Analytics) to understand general traffic patterns, such as which geographic regions our users are from and which types of deals are most popular. This data is aggregated and anonymized.</p>

            <h2>4. Policy Updates</h2>
            <p>We may update this policy periodically to reflect changes in legal requirements or operational practices. Any updates will be posted directly to this page.</p>
        </main>
    `,
    
    terms: `
        <main class="page-container">
            <h1>Terms & Conditions</h1>
            <p><em>Effective Date: July 2026</em></p>
            <p>By accessing or utilizing FridayDeals.online, you agree to be bound by the following terms of service. Please read them carefully.</p>

            <h2>1. Nature of the Platform</h2>
            <p>FridayDeals.online is an informational curation and deal discovery platform. We act strictly as an intermediary connecting consumers with third-party retailers. <strong>We do not manufacture, stock, sell, or distribute any physical or digital products.</strong></p>

            <h2>2. Disclaimer of Pricing and Availability</h2>
            <p>E-commerce pricing is controlled by algorithms and is inherently volatile. While we strive to ensure our data feeds are accurate and up-to-date at the time of publishing, we cannot guarantee that a deal will remain active or that a price will not change.</p>
            <p><strong>The final, legally binding price of any item is the price displayed on the third-party retailer's final checkout page.</strong> FridayDeals.online cannot be held responsible for pricing discrepancies, out-of-stock items, or expired promotional codes.</p>

            <h2>3. Limitation of Liability regarding Transactions</h2>
            <p>Because we do not process transactions, we assume zero liability for the fulfillment of orders. Any dispute regarding shipping delays, damaged goods, returns, refunds, or customer service must be handled directly with the retailer where the transaction occurred (e.g., Amazon, Flipkart). We cannot intervene on your behalf.</p>

            <h2>4. Intellectual Property</h2>
            <p>The layout, design, copy, and curation methodology of FridayDeals.online are the property of our platform. Product images, brand names, and trademarks displayed on our site are the property of their respective owners and are used strictly for identification purposes under fair use.</p>
        </main>
    `,
    
    contact: `
        <main class="page-container">
            <h1>Contact Us</h1>
            <p>Whether you are a user with feedback or a brand looking to establish a performance partnership, we value clear, efficient communication. Please direct your inquiries to the appropriate channel below.</p>
            
            <h2>Partnerships & Advertising</h2>
            <p>For brands, agencies, and retail networks looking to feature products or establish a direct affiliate relationship with our platform.</p>
            <p><strong>Email:</strong> partnerships@fridaydeals.online</p>
            
            <h2>Technical Support & Bug Reports</h2>
            <p>If you encounter a broken link, a visual glitch, or have general feedback regarding the website's performance.</p>
            <p><strong>Email:</strong> support@fridaydeals.online</p>
            
            <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 40px 0;">
            
            <h2 style="color: #ef4444;">⚠️ Critical Customer Service Notice</h2>
            <p><strong>FridayDeals.online is a discovery engine. We do not process orders or sell products directly.</strong></p>
            <p>If you have a problem with an item you purchased (e.g., it hasn't arrived, it is defective, or you need a refund), you <strong>must</strong> contact the customer service department of the retailer you bought it from (such as Amazon or Flipkart). We do not have access to your order history and cannot assist with shipping or return logistics.</p>
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

    if (drawer.classList.contains('open')) {
        toggleDrawer();
    }

    if (hash === 'home') {
        searchInput.style.display = 'block';
        menuToggle.style.display = 'flex'; 
        
        if (allProducts.length === 0) {
            fetchDeals();
        } else {
            renderFilters();
            applyFilters();
        }
        searchInput.addEventListener('input', handleSearch);
    } else {
        searchInput.style.display = 'none';
        menuToggle.style.display = 'none'; 
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
            const grid = document.getElementById('productsGrid');
            if(grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; font-weight: 600; color: #64748b;">Failed to connect to database. Check network.</div>';
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
    toggleDrawer(); 
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
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; font-weight: 600; color: #64748b;">0 Results Found.</div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const title = product.Title || product.title || 'Untitled Deal';
        const price = product.Price || product.price || '';
        const oldPrice = product.OldPrice || product.oldPrice || '';
        const img = product.ImageURL || product.image || '';
        const link = product.AffiliateLink || product.link || '#';

        // --- STORE DETECTION ENGINE ---
        let store = 'Verified Deal';
        let storeClass = 'other';
        const urlString = link.toLowerCase();
        
        if (urlString.includes('amazon.in') || urlString.includes('amzn.to')) {
            store = 'Amazon'; 
            storeClass = 'amazon';
        } else if (urlString.includes('flipkart.com') || urlString.includes('fkrt.it')) {
            store = 'Flipkart'; 
            storeClass = 'flipkart';
        } else if (urlString.includes('myntra.com')) {
            store = 'Myntra'; 
            storeClass = 'myntra';
        }

        return `
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="product-card">
                <img src="${img}" alt="${title}" loading="lazy">
                
                <span class="store-badge ${storeClass}">${store}</span>
                
                <h3>${title}</h3>
                <div class="price-row">
                    <span class="price">${price}</span>
                    <span class="old-price">${oldPrice}</span>
                </div>
                <div class="buy-btn-visual">Grab Deal</div>
            </a>
        `;
    }).join('');
}
