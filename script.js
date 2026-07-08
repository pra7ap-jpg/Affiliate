let allProducts = [];
let activeCategory = 'All';
let currentSearchTerm = '';
let dotdInterval;
let trustInterval;

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
        <section class="trust-banner">
            <h1 class="animated-hero"><span>Curated.</span> <span>Verified.</span> <span>Unbeatable.</span></h1>
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
            <a href="${link}" target="_blank" class="dotd-slide ${index === 0 ? 'active' : ''}">
                <img src="${img}" alt="${title}">
                <div class="dotd-info">
                    <h3>${title}</h3>
                    <div class="dotd-price">${price}</div>
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
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; font-weight: 600; color: #64748b;">0 Results Found.</div>';
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
