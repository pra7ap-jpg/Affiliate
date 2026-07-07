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
        <!-- Trust & Security Hero -->
        <section class="trust-banner">
            <h1>Curated. Verified. Unbeatable.</h1>
            <div class="trust-grid">
                <div class="trust-card">
                    <h3>🛡️ Strict Verification</h3>
                    <p>Every deal is analyzed against historical pricing data to ensure the discount is genuine.</p>
                </div>
                <div class="trust-card highlight">
                    <h3>⚡ Direct to Retailer</h3>
                    <p>No middlemen. Clicking a deal takes you straight to the official Amazon or Flipkart product page.</p>
                </div>
                <div class="trust-card">
                    <h3>🎯 Quality Filtered</h3>
                    <p>We bypass the junk and only curate products with high consumer utility and brand reputation.</p>
                </div>
            </div>
        </section>

        <!-- Product Grid -->
        <main class="grid-container" id="productsGrid">
            <div style="grid-column: 1/-1; text-align: center; font-weight: 800; padding: 60px; font-size: 1.2rem;">
                Hunting the latest deals...
            </div>
        </main>

        <!-- Detailed Disclosure -->
        <section class="full-disclosure">
            <h2>Our Affiliate Model & Transparency</h2>
            <p><strong>How we keep this free:</strong> FridayDeals.online is a reader-supported deal curation engine. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a referral commission.</p>
            <p><strong>Does this cost you extra?</strong> Absolutely not. The commission is paid entirely by the retailer (like Amazon or Flipkart) out of their profit margin. The price you pay at checkout is exactly the same whether you use our tracking link or find the item independently.</p>
            <p>We are independently owned and the opinions expressed here are our own. We never allow brands to pay for artificial "deal" placement.</p>
        </section>
    `,
    about: `
        <main class="page-container">
            <h1>About FridayDeals</h1>
            <p>We are a dedicated curation platform built for consumers who value performance, quality, and rigorous deal verification.</p>
            <h2>Our Mission</h2>
            <p>The modern e-commerce landscape is flooded with inflated retail prices, counterfeit discounts, and overwhelming choice paralysis. Our core mission is to cut through the noise. We leverage analytical market tracking to identify genuine price drops.</p>
        </main>
    `,
    privacy: `
        <main class="page-container">
            <h1>Privacy Policy</h1>
            <p>At FridayDeals.online, we believe in minimal data collection. We do not require account creation, and we do not collect personally identifiable information (PII).</p>
            <h2>Cookies and Tracking Technologies</h2>
            <p>We use cookies solely to facilitate our affiliate tracking. When you click an outbound link, an affiliate cookie is placed on your browser to inform the retailer that FridayDeals referred you.</p>
        </main>
    `,
    terms: `
        <main class="page-container">
            <h1>Terms & Conditions</h1>
            <h2>Platform Function</h2>
            <p>FridayDeals.online operates exclusively as a curation and referral platform. We do not hold inventory, process payments, or manage order fulfillment.</p>
            <h2>Pricing Volatility</h2>
            <p>We continuously monitor our data feeds, but e-commerce pricing is highly volatile. <strong>The final price you pay is the price displayed on the retailer's checkout page.</strong></p>
        </main>
    `,
    contact: `
        <main class="page-container">
            <h1>Contact Us</h1>
            <p>Email: <strong>partnerships@fridaydeals.online</strong></p>
            <hr style="border: 2px solid #111; margin: 40px 0;">
            <h2>⚠️ Important Notice</h2>
            <p><strong>We do not sell products directly.</strong> If you have an issue regarding order tracking, refunds, or returns, you must contact Amazon or Flipkart directly.</p>
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

    // If leaving Home, close the drawer automatically
    if (drawer.classList.contains('open')) {
        toggleDrawer();
    }

    if (hash === 'home') {
        searchInput.style.display = 'block';
        menuToggle.style.display = 'flex'; // Show Hamburger
        
        if (allProducts.length === 0) {
            fetchDeals();
        } else {
            renderFilters();
            applyFilters();
        }
        searchInput.addEventListener('input', handleSearch);
    } else {
        searchInput.style.display = 'none';
        menuToggle.style.display = 'none'; // Hide Hamburger on text pages
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
            if(grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; font-weight: 800;">Failed to load deals. Check your connection.</div>';
        });
}

function renderFilters() {
    const filterContainer = document.getElementById('categoryFilters');
    if (!filterContainer) return;

    const categories = ['All', ...new Set(allProducts.map(p => p.Category || p.category).filter(Boolean))];
    
    // Inject filters into the side drawer instead of the main page
    filterContainer.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${activeCategory === cat ? 'active' : ''}" onclick="setCategory('${cat}')">${cat}</button>`
    ).join('');
}

function setCategory(category) {
    activeCategory = category;
    renderFilters(); // Re-render to update active class
    applyFilters();
    toggleDrawer(); // Auto-close drawer when category is selected
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
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; font-weight: 800;">No deals found matching your search.</div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const title = product.Title || product.title || 'Deal of the Day';
        const price = product.Price || product.price || '';
        const oldPrice = product.OldPrice || product.oldPrice || '';
        const img = product.ImageURL || product.image || '';
        const link = product.AffiliateLink || product.link || '#';

        // The entire card is wrapped in an anchor tag <a> so clicking anywhere takes them to Amazon/Flipkart
        return `
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="product-card">
                <img src="${img}" alt="${title}" loading="lazy">
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
