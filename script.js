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
            <div class="hero-grid">
                <div class="hero-title">
                    <h1>Data<br>Driven<br>Deals.</h1>
                </div>
                <div class="hero-stats">
                    <div class="stat-box">
                        <h3>01. Verification</h3>
                        <p>Strict historical pricing analysis ensures discounts are mathematically genuine.</p>
                    </div>
                    <div class="stat-box">
                        <h3>02. Direct Access</h3>
                        <p>Zero middlemen. Links route directly to the official retail landing pages.</p>
                    </div>
                    <div class="stat-box">
                        <h3>03. Curation</h3>
                        <p>Aggressive filtering removes counterfeit brands and low-utility consumer junk.</p>
                    </div>
                </div>
            </div>
        </section>

        <main class="grid-container" id="productsGrid">
            <div style="grid-column: 1/-1; text-align: center; font-weight: 800; padding: 60px; font-size: 1.2rem; text-transform: uppercase;">
                Fetching Database...
            </div>
        </main>

        <section class="full-disclosure">
            <h2>Affiliate Transparency</h2>
            <p><strong>Operational Model:</strong> FridayDeals is a reader-supported curation engine. Outbound clicks resulting in a purchase may generate a referral commission.</p>
            <p><strong>Consumer Impact:</strong> The commission is levied entirely on the retailer's margin. The checkout price remains fundamentally identical whether routed through our tracking architecture or accessed independently.</p>
            <p>We maintain independent operational control. Sponsored artificial deal placement is strictly prohibited.</p>
        </section>
    `,
    about: `
        <main class="page-container">
            <h1>About</h1>
            <p>We are a dedicated curation platform built for consumers who value performance, quality, and rigorous deal verification.</p>
            <h2>Mission Statement</h2>
            <p>The modern e-commerce landscape is flooded with inflated retail prices, counterfeit discounts, and overwhelming choice paralysis. Our core mission is to cut through the noise. We leverage analytical market tracking to identify genuine price drops.</p>
        </main>
    `,
    privacy: `
        <main class="page-container">
            <h1>Privacy Policy</h1>
            <p>At FridayDeals, we operate on minimal data collection. We do not mandate account creation, nor do we harvest personally identifiable information (PII).</p>
            <h2>Tracking Protocols</h2>
            <p>We utilize cookies strictly to facilitate affiliate routing. Upon clicking an outbound link, an affiliate token is lodged in your browser to inform the retailer of the referral origin.</p>
        </main>
    `,
    terms: `
        <main class="page-container">
            <h1>Terms</h1>
            <h2>Platform Architecture</h2>
            <p>FridayDeals operates exclusively as a curation node. We hold zero physical inventory, process zero payments, and manage zero fulfillment logistics.</p>
            <h2>Pricing Volatility</h2>
            <p>Data feeds are continuously synchronized, however, retail pricing is volatile. <strong>The final executable price is determined exclusively by the retailer at checkout.</strong></p>
        </main>
    `,
    contact: `
        <main class="page-container">
            <h1>Contact</h1>
            <p>Email routing: <strong>partnerships@fridaydeals.online</strong></p>
            <h2>Support Notice</h2>
            <p><strong>We do not process transactions.</strong> Logistics, tracking, or refund inquiries must be directed to the corresponding retailer (Amazon/Flipkart).</p>
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
            if(grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; font-weight: 800; text-transform: uppercase;">Connection Terminated. Check Network.</div>';
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
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; font-weight: 800; text-transform: uppercase;">0 Results Found.</div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const title = product.Title || product.title || 'Untitled Asset';
        const price = product.Price || product.price || '';
        const oldPrice = product.OldPrice || product.oldPrice || '';
        const img = product.ImageURL || product.image || '';
        const link = product.AffiliateLink || product.link || '#';

        return `
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="product-card">
                <img src="${img}" alt="${title}" loading="lazy">
                <h3>${title}</h3>
                <div class="price-row">
                    <span class="price">${price}</span>
                    <span class="old-price">${oldPrice}</span>
                </div>
                <div class="buy-btn-visual">Execute Purchase</div>
            </a>
        `;
    }).join('');
}
