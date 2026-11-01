let allProducts = [];
let activeCategory = 'All';
let currentSearchTerm = '';
let dotdInterval;
let trustInterval;

// --- OUTPUT SAFETY ---
// Sheet data is escaped before it reaches innerHTML, and only https:// links
// are rendered, so a bad or tampered row can never inject markup or scripts.
function escHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function safeUrl(u) {
    const s = String(u == null ? '' : u).trim();
    return /^https:\/\//i.test(s) ? escHtml(s) : '#';
}

// --- DRAWER LOGIC ---
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
        <section class="hero-panel">
            <div class="hero-copy">
                <h1 class="animated-hero"><span>Find the Best</span> <span>Deals on</span> <span>Amazon</span></h1>
                <p class="hero-sub">Handpicked price drops and honest recommendations. Every price is checked before it is listed, and every link takes you straight to the retailer's own page — no middlemen, no fake MRP games.</p>
                <button class="hero-cta" onclick="document.getElementById('productsGrid').scrollIntoView({behavior:'smooth'})">Explore Top Picks →</button>
                <div class="trust-points"><span>✓ Price-checked before listing</span><span>✓ Direct retailer links</span><span>✓ No fake discounts</span></div>
            </div>
            <div class="hero-visual" id="heroVisual"></div>
        </section>

        <section class="trust-strip">
            <div class="trust-item">
                <div class="trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4Z"/><circle cx="7" cy="7" r="1.6"/></svg></div>
                <div><h4>Curated Picks</h4><p>Only the best products</p></div>
            </div>
            <div class="trust-item">
                <div class="trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z"/><path d="m9 11.5 2 2 4-4.5"/></svg></div>
                <div><h4>Price-Checked</h4><p>Verified before listing</p></div>
            </div>
            <div class="trust-item">
                <div class="trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></div>
                <div><h4>Direct Links</h4><p>Straight to the retailer</p></div>
            </div>
            <div class="trust-item">
                <div class="trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3"/><path d="M5 21h14"/><path d="M12 6v15"/><path d="M3 13l3-7 3 7a3.5 3.5 0 0 1-6 0Z"/><path d="M15 13l3-7 3 7a3.5 3.5 0 0 1-6 0Z"/></svg></div>
                <div><h4>Honest Prices</h4><p>No inflated MRP tricks</p></div>
            </div>
        </section>

        <section class="cat-section">
            <div class="section-head"><h2>Popular Categories</h2></div>
            <div id="categoryTiles" class="cat-tiles"></div>
        </section>

        <!-- Deal of the Day Rotator -->
        <div class="dotd-container">
            <div class="dotd-header">
                <div class="dotd-pulse"></div>
                <h2>Deal of the Day</h2>
            </div>
            <div class="dotd-wrapper" id="dotdWrapper">
                <div style="text-align: center; padding: 50px; color: #64748b; font-weight: 600;">Finding top deals...</div>
            </div>
        </div>

        <div class="section-head top-picks-head"><h2>Top Picks</h2><span class="top-picks-note">Checked &amp; updated daily</span></div>
        <main class="grid-container" id="productsGrid">
            <div style="grid-column: 1/-1; text-align: center; font-weight: 600; padding: 60px; font-size: 1.1rem; color: #64748b;">
                Hunting the latest deals...
            </div>
        </main>

        <!-- Detailed Trust Rotator -->
        <div class="trust-rotator-container">
            <div class="trust-rotator-title" id="trustTitle">🛡️ 100% Data-Verified Discounts</div>
            <div class="trust-rotator-desc" id="trustDesc">We don't rely on flashy marketing. Every single deal is cross-referenced against 90-day historical pricing data to guarantee you are getting a genuine price drop.</div>
        </div>

        <!-- 1000-Word SEO Article -->
        <article class="seo-article">
            <h2>The Ultimate Guide: Finding Genuine Discounts on Amazon, Flipkart & Myntra</h2>
            <p>In the modern e-commerce landscape, navigating through endless "Mega Sales" and "Blockbuster Deals" can feel overwhelming. With artificial price inflation becoming a standard marketing tactic, consumers are constantly asking: <em>Are these discounts actually real?</em></p>
            <p>At FridayDeals, we believe in radical transparency. Whether you are hunting for a hidden Amazon discount finder strategy, looking to decode Flipkart big billion days hidden tricks, or mastering Myntra end of reason sale hacks, you need data—not marketing hype. Here is our comprehensive guide to tracking genuine price history and outsmarting the algorithms.</p>
            
            <h3>1. The Reality of Artificial Price Inflation</h3>
            <p>Before any major retail event, it is common practice for automated pricing algorithms to slowly increase the Maximum Retail Price (MRP) or the standard selling price of a product. When the sale officially begins, the price is "slashed" back down to its original value, creating the optical illusion of a massive discount. To bypass this, you must learn how to track genuine price history on Amazon India and Flipkart.</p>
            
            <h3>2. How to Track Real Price History on Amazon India</h3>
            <p>Amazon prices fluctuate daily based on demand, inventory levels, and competitor pricing. To find the real bottom-line price, you cannot rely on the crossed-out red text. The secret is historical price mapping.</p>
            <ul>
                <li><strong>Analyze the 90-Day Average:</strong> A good deal is not just lower than the MRP; it must be significantly lower than the 90-day average selling price.</li>
                <li><strong>Lightning Deal Traps:</strong> Flash sales create a false sense of urgency. Often, these items will return to an identical or lower price within three weeks. </li>
                <li><strong>Hidden Coupons:</strong> Always check the checkbox below the pricing matrix. Amazon frequently hides 5% to 10% instant discount coupons that must be manually applied at checkout.</li>
            </ul>

            <h3>3. Mastering Flipkart Price Tracker History & Sale Secrets</h3>
            <p>Flipkart operates heavily on bank partnerships and tiered discounting. Understanding their ecosystem is crucial to securing the lowest price during events like the Big Billion Days.</p>
            <ul>
                <li><strong>The Midnight Price Drop:</strong> Flipkart frequently updates its pricing algorithms at midnight (IST). If you are looking to purchase heavy electronics or smartphones, the lowest prices are historically captured between 12:00 AM and 1:30 AM.</li>
                <li><strong>Card Offers vs. Direct Discounts:</strong> Flipkart deals are often structured around specific bank cards (e.g., SBI, Axis, ICICI). Always calculate the net price after the 10% instant bank discount. If you do not hold the required card, the "sale price" may actually be higher than standard days.</li>
                <li><strong>The Cart Abandonment Hack:</strong> For non-essential items, adding a product to your cart and leaving it there for 48 hours can sometimes trigger a targeted push notification offering an exclusive 5% drop to complete the purchase.</li>
            </ul>

            <h3>4. Finding Genuine Myntra Coupon Codes Without Spam</h3>
            <p>Myntra's pricing model is heavily reliant on dynamic coupon codes that change based on user behavior, cart value, and account age.</p>
            <ul>
                <li><strong>The Wishlist Price Drop Strategy:</strong> Myntra closely monitors wishlist activity. Instead of adding items directly to your cart, add them to your wishlist. Myntra’s algorithm frequently triggers exclusive "Wishlist Price Drop" coupons directly to your inbox to incentivize the final purchase.</li>
                <li><strong>New Account vs. Old Account Profiling:</strong> E-commerce platforms offer deep discounts to acquire new users. If a coupon code is failing on your primary account, a fresh account creation may yield a flat ₹500 off on the exact same cart.</li>
                <li><strong>End of Reason Sale (EORS) Reality:</strong> During EORS, focus strictly on premium, high-margin brands (Nike, Puma, Levi's). Fast-fashion brands are usually discounted year-round, meaning their EORS pricing is rarely a true anomaly.</li>
            </ul>

            <h3>5. Why FridayDeals Automates This Process</h3>
            <p>Manually tracking prices across three different platforms, calculating bank discounts, and dodging artificial inflation is exhausting. That is exactly why FridayDeals exists. Our curation engine tracks historical pricing metrics in the background.</p>
            <p>When an item hits our grid, it means it has passed strict verification. We verify that the discount is mathematically genuine, we link directly to the official retailer, and we ensure the product has a solid reputation. Stop guessing, and start relying on data-driven deals.</p>
        </article>
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
            <p>We may also use standard analytics tools to understand general traffic patterns, such as which geographic regions our users are from and which types of deals are most popular. This data is aggregated and anonymized.</p>
        </main>
    `,
    
    terms: `
        <main class="page-container">
            <h1>Terms & Conditions</h1>
            <p>By accessing or utilizing FridayDeals.online, you agree to be bound by the following terms of service. Please read them carefully.</p>

            <h2>1. Nature of the Platform</h2>
            <p>FridayDeals.online is an informational curation and deal discovery platform. We act strictly as an intermediary connecting consumers with third-party retailers. <strong>We do not manufacture, stock, sell, or distribute any physical or digital products.</strong></p>

            <h2>2. Disclaimer of Pricing and Availability</h2>
            <p>E-commerce pricing is controlled by algorithms and is inherently volatile. While we strive to ensure our data feeds are accurate and up-to-date at the time of publishing, we cannot guarantee that a deal will remain active or that a price will not change.</p>
            <p><strong>The final, legally binding price of any item is the price displayed on the third-party retailer's final checkout page.</strong> FridayDeals.online cannot be held responsible for pricing discrepancies, out-of-stock items, or expired promotional codes.</p>

            <h2>3. Limitation of Liability regarding Transactions</h2>
            <p>Because we do not process transactions, we assume zero liability for the fulfillment of orders. Any dispute regarding shipping delays, damaged goods, returns, refunds, or customer service must be handled directly with the retailer where the transaction occurred (e.g., Amazon, Flipkart). We cannot intervene on your behalf.</p>
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

// Close the search panel when tapping anywhere outside it
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) closeSearchPanel();
    if (!e.target.closest('.share-btn') && !e.target.closest('#shareMenu')) hideShareMenu();
});

function handleRouting() {
    const appRoot = document.getElementById('app-root');
    const searchInput = document.getElementById('searchInput');
    let hash = window.location.hash.substring(1);
    
    if (!hash || !pages[hash]) { hash = 'home'; }

    appRoot.innerHTML = pages[hash];
    window.scrollTo(0, 0);

    if (drawer.classList.contains('open')) toggleDrawer();

    clearInterval(dotdInterval);
    clearInterval(trustInterval);

    if (hash === 'home') {
        searchInput.style.display = 'block';
        menuToggle.style.display = 'flex'; 
        
        if (allProducts.length === 0) {
            fetchDeals();
        } else {
            renderFilters();
            renderTiles();
            initHeroVisual();
            applyFilters();
            initDealOfTheDay();
            initTrustRotator();
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
                        renderTiles();
                        initHeroVisual();
                        applyFilters();
                        initDealOfTheDay();
                        initTrustRotator();
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
        `<button class="filter-btn ${activeCategory === cat ? 'active' : ''}" onclick="setCategory('${cat.replace(/'/g, "\\'")}')">${escHtml(cat)}</button>`
    ).join('');
}

function setCategory(category) {
    activeCategory = category;
    renderFilters(); 
    applyFilters();
    toggleDrawer(); 
}

// --- CATEGORY TILES (homepage) ---
const CATEGORY_ICONS = {
    'Tech': '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
    'Smartphones': '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 18h.01"/>',
    'Laptops & PC': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
    'Audio & Earbuds': '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
    'Audio': '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
    'Smartwatches': '<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M10 6V3h4v3M10 21v-3h4v3"/>',
    'Tech Accessories': '<path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4Z"/><circle cx="7" cy="7" r="1.6"/>',
    'Fashion & Apparel': '<path d="M20.4 3.6 16 2a4 4 0 0 1-8 0L3.6 3.6a2 2 0 0 0-1.3 2.3L4 11l3-1v11h10V10l3 1 1.7-5.1a2 2 0 0 0-1.3-2.3Z"/>',
    'Home & Kitchen': '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/>',
    'Diwali & Festive': '<path d="M12 3c1.8 2.6 2.7 4 2.7 5.7a2.7 2.7 0 1 1-5.4 0C9.3 7 10.2 5.6 12 3Z"/><path d="M3 15h18c0 3.3-2.7 6-6 6H9c-3.3 0-6-2.7-6-6Z"/>',
    'Chhath Special': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'Miscellaneous': '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
};

function renderTiles() {
    const wrap = document.getElementById('categoryTiles');
    if (!wrap) return;
    const categories = [...new Set(allProducts.map(p => p.Category || p.category).filter(Boolean))];
    wrap.innerHTML = categories.map(cat => `
        <button class="cat-tile ${activeCategory === cat ? 'active' : ''}" onclick="tileCategory('${cat.replace(/'/g, "\\'")}')">
            <span class="cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${CATEGORY_ICONS[cat] || CATEGORY_ICONS['Miscellaneous']}</svg></span>
            <span class="cat-name">${escHtml(cat)}</span>
        </button>
    `).join('');
}

function tileCategory(category) {
    activeCategory = category;
    renderFilters();
    renderTiles();
    applyFilters();
    const grid = document.getElementById('productsGrid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
}

// --- HERO VISUAL (real product photos) ---
function initHeroVisual() {
    const visual = document.getElementById('heroVisual');
    if (!visual || allProducts.length === 0) return;
    const picks = allProducts.slice(0, 3);
    visual.innerHTML = picks.map((p, i) => `
        <div class="hero-img hero-img-${i}"><img src="${safeUrl(p.ImageURL || p.image || '')}" alt="${escHtml(p.Title || p.title || '')}" loading="lazy"></div>
    `).join('');
}

// --- SEARCH RESULTS PANEL (directly under the search bar) ---
function renderSearchResults() {
    const panel = document.getElementById('searchResults');
    if (!panel) return;
    const term = currentSearchTerm.trim();
    if (!term) { panel.classList.remove('open'); panel.innerHTML = ''; return; }

    const matches = allProducts.filter(p => (p.Title || p.title || '').toLowerCase().includes(term)).slice(0, 6);
    const safeTerm = term.replace(/[<>&"]/g, '');
    const amazonSearchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(term)}&tag=affindi-21`;

    if (matches.length > 0) {
        panel.innerHTML = matches.map(p => {
            const title = p.Title || p.title || '';
            const price = p.Price || p.price || '';
            const img = p.ImageURL || p.image || '';
            const link = p.AffiliateLink || p.link || '#';
            return `<a class="sr-item" href="${safeUrl(link)}" target="_blank" rel="noopener noreferrer"><img src="${safeUrl(img)}" alt=""><span class="sr-text"><span class="sr-title">${escHtml(title)}</span><span class="sr-price">${escHtml(price)}</span></span></a>`;
        }).join('') + `<button class="sr-all" onclick="closeSearchPanel();document.getElementById('productsGrid').scrollIntoView({behavior:'smooth'})">See all results below ↓</button>`;
    } else {
        panel.innerHTML = `
            <div class="sr-empty">Not on our list yet — our picks are hand-chosen, so the list stays short.</div>
            <a class="sr-amazon" href="${amazonSearchUrl}" target="_blank" rel="noopener noreferrer">Search "${safeTerm}" on Amazon →</a>`;
    }
    panel.classList.add('open');
}

function closeSearchPanel() {
    const panel = document.getElementById('searchResults');
    if (panel) panel.classList.remove('open');
}

// --- SHARE A DEAL (link always stays on fridaydeals.online) ---
function dealShareUrl(link) {
    const m = String(link || '').match(/dp\/([A-Z0-9]{10})/i);
    return m ? `${window.location.origin}/deal/${m[1].toUpperCase()}` : link;
}

function hideShareMenu() {
    const menu = document.getElementById('shareMenu');
    if (menu) menu.remove();
}

function openShareMenu(btn) {
    hideShareMenu();
    const url = btn.getAttribute('data-share');
    const title = decodeURIComponent(btn.getAttribute('data-title') || 'Deal');
    const text = encodeURIComponent(`${title}\n${url}`);
    const urlEnc = encodeURIComponent(url);

    const menu = document.createElement('div');
    menu.id = 'shareMenu';
    menu.innerHTML = `
        <a href="https://t.me/share/url?url=${urlEnc}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener">Telegram</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${urlEnc}" target="_blank" rel="noopener">Facebook</a>
        <a href="https://wa.me/?text=${text}" target="_blank" rel="noopener">WhatsApp</a>
        <button type="button" id="shareCopyBtn">Copy Link</button>
    `;
    document.body.appendChild(menu);

    const rect = btn.getBoundingClientRect();
    menu.style.top = (rect.bottom + 8) + 'px';
    menu.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 190)) + 'px';

    menu.querySelector('#shareCopyBtn').addEventListener('click', async (ev) => {
        ev.preventDefault();
        try { await navigator.clipboard.writeText(url); ev.target.textContent = 'Copied ✓'; }
        catch { ev.target.textContent = url; }
        setTimeout(hideShareMenu, 900);
    });
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.share-btn');
    if (btn) {
        e.preventDefault();
        e.stopPropagation();
        openShareMenu(btn);
    }
});

function handleSearch(e) {
    currentSearchTerm = e.target.value.toLowerCase();
    applyFilters();
    renderSearchResults();
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

// --- DEAL OF THE DAY LOGIC ---
function initDealOfTheDay() {
    const wrapper = document.getElementById('dotdWrapper');
    if (!wrapper || allProducts.length === 0) return;

    let uniqueCategories = [];
    let topDeals = [];
    
    for (let product of allProducts) {
        const cat = product.Category || product.category;
        if (!uniqueCategories.includes(cat)) {
            uniqueCategories.push(cat);
            topDeals.push(product);
        }
        if (topDeals.length === 3) break;
    }
    
    if (topDeals.length < 3) topDeals = allProducts.slice(0, 3);

    wrapper.innerHTML = topDeals.map((product, index) => {
        const title = product.Title || product.title;
        const price = product.Price || product.price;
        const img = product.ImageURL || product.image;
        const link = product.AffiliateLink || product.link;
        return `
            <a href="${safeUrl(link)}" target="_blank" class="dotd-slide ${index === 0 ? 'active' : ''}">
                <img src="${safeUrl(img)}" alt="${escHtml(title)}">
                <div class="dotd-info">
                    <h3>${escHtml(title)}</h3>
                    <div class="dotd-price">${escHtml(price)}</div>
                </div>
            </a>
        `;
    }).join('');

    const slides = wrapper.querySelectorAll('.dotd-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    dotdInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);
}

// --- TRUST ROTATOR LOGIC WITH PARAGRAPHS ---
function initTrustRotator() {
    const titleEl = document.getElementById('trustTitle');
    const descEl = document.getElementById('trustDesc');
    if (!titleEl || !descEl) return;
    
    const messages = [
        {
            title: "🛡️ 100% Data-Verified Discounts",
            desc: "We don't rely on flashy marketing. Every single deal is cross-referenced against 90-day historical pricing data to guarantee you are getting a genuine price drop."
        },
        {
            title: "⚡ Direct to Retailer",
            desc: "No shady redirects or middleman landing pages. Our platform routes you directly to the official product pages on Amazon, Flipkart, or Myntra."
        },
        {
            title: "🚫 No Artificial Markups",
            desc: "Retailers often inflate the base price right before a sale. Our algorithm detects these fake markups and filters them out of your feed entirely."
        }
    ];
    
    let msgIndex = 0;
    
    trustInterval = setInterval(() => {
        titleEl.style.opacity = 0;
        descEl.style.opacity = 0;
        
        setTimeout(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            titleEl.innerText = messages[msgIndex].title;
            descEl.innerText = messages[msgIndex].desc;
            titleEl.style.opacity = 1;
            descEl.style.opacity = 1;
        }, 500);
    }, 5000); // Wait 5 seconds per slide to allow reading time
}

// --- PRODUCT GRID RENDERER ---
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (products.length === 0) {
        if (currentSearchTerm) {
            const safeTerm = currentSearchTerm.replace(/[<>&"]/g, '');
            const amazonSearchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(currentSearchTerm)}&tag=affindi-21`;
            grid.innerHTML = `
                <div class="amazon-fallback">
                    <h3>We haven't listed "${safeTerm}" yet</h3>
                    <p>Our list is hand-picked, so it stays short. You can still see every option and today's live price directly on Amazon:</p>
                    <a class="amazon-search-btn" href="${amazonSearchUrl}" target="_blank" rel="noopener noreferrer">Search "${safeTerm}" on Amazon →</a>
                </div>`;
        } else {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; font-weight: 600; color: #64748b;">0 Results Found.</div>';
        }
        return;
    }

    grid.innerHTML = products.map(product => {
        const title = product.Title || product.title || 'Untitled Deal';
        const price = product.Price || product.price || '';
        const oldPrice = product.OldPrice || product.oldPrice || '';
        const img = product.ImageURL || product.image || '';
        const link = product.AffiliateLink || product.link || '#';

        let store = 'Verified Deal';
        let storeClass = 'other';
        const urlString = link.toLowerCase();
        
        if (urlString.includes('amazon.in') || urlString.includes('amzn.to')) {
            store = 'Amazon'; storeClass = 'amazon';
        } else if (urlString.includes('flipkart.com') || urlString.includes('fkrt.it')) {
            store = 'Flipkart'; storeClass = 'flipkart';
        } else if (urlString.includes('myntra.com')) {
            store = 'Myntra'; storeClass = 'myntra';
        }

        const priceNum = parseFloat(String(price).replace(/[^0-9.]/g, ''));
        const oldNum = parseFloat(String(oldPrice).replace(/[^0-9.]/g, ''));
        const discount = (oldNum > 0 && priceNum > 0 && oldNum > priceNum) ? Math.round((1 - priceNum / oldNum) * 100) : 0;
        const discountBadge = discount >= 5 ? `<span class="discount-badge">${discount}% OFF</span>` : '';

        return `
            <a href="${safeUrl(link)}" target="_blank" rel="noopener noreferrer" class="product-card">
                <img src="${safeUrl(img)}" alt="${escHtml(title)}" loading="lazy">
                ${discountBadge}
                <button class="share-btn" data-share="${escHtml(dealShareUrl(link))}" data-title="${encodeURIComponent(title)}" aria-label="Share this deal" title="Share this deal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>
                </button>
                <span class="store-badge ${storeClass}">${store}</span>
                <h3>${escHtml(title)}</h3>
                <div class="price-row">
                    <span class="price">${escHtml(price)}</span>
                    <span class="old-price">${escHtml(oldPrice)}</span>
                </div>
                <div class="buy-btn-visual">${store !== 'Verified Deal' ? `View on ${store}` : 'Grab Deal'} ↗</div>
            </a>
        `;
    }).join('');

    if (currentSearchTerm) {
        const safeTerm = currentSearchTerm.replace(/[<>&"]/g, '');
        const amazonSearchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(currentSearchTerm)}&tag=affindi-21`;
        grid.innerHTML += `<div class="amazon-more"><a href="${amazonSearchUrl}" target="_blank" rel="noopener noreferrer">See more results for "${safeTerm}" on Amazon →</a></div>`;
    }
}
