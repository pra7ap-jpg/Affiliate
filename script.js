let allProducts = [];
let activeCategory = 'All';

// 1. Fetch Deals with Cache Buster
function fetchDeals() {
    // The '?t=' + timestamp forces the browser to bypass its cache and pull a fresh copy
    const freshUrl = '/api/deals?t=' + new Date().getTime();

    fetch(freshUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    allProducts = results.data;
                    renderFilters();
                    applyFilters();
                }
            });
        })
        .catch(err => {
            console.error("Error fetching deals:", err);
            const grid = document.getElementById('productsGrid');
            if(grid) grid.innerHTML = '<div class="loading">Failed to load deals.</div>';
        });
}

// 2. Setup Category Filters
function renderFilters() {
    const filterContainer = document.getElementById('filterContainer');
    if (!filterContainer) return;

    // Extract unique categories from the spreadsheet data
    const categories = ['All', ...new Set(allProducts.map(p => p.Category || p.category).filter(Boolean))];
    
    filterContainer.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${activeCategory === cat ? 'active' : ''}" onclick="setCategory('${cat}')">${cat}</button>`
    ).join('');
}

// 3. Handle Category Clicks
function setCategory(category) {
    activeCategory = category;
    renderFilters();
    applyFilters();
}

// 4. Apply Filters and Trigger Rendering
function applyFilters() {
    const filtered = activeCategory === 'All' 
        ? allProducts 
        : allProducts.filter(p => (p.Category || p.category) === activeCategory);
    
    renderProducts(filtered);
}

// 5. Render Products to the UI
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div class="empty-state">No deals found for this category.</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.ImageURL || product.image || ''}" alt="${product.Title || product.title}" loading="lazy">
            <div class="product-info">
                <h3>${product.Title || product.title}</h3>
                <div class="price-row">
                    <span class="price">${product.Price || product.price}</span>
                    <span class="old-price">${product.OldPrice || product.oldPrice || ''}</span>
                </div>
                <a href="${product.AffiliateLink || product.link}" target="_blank" class="buy-btn">Grab Deal</a>
            </div>
        </div>
    `).join('');
}

// Initialize the app when the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    fetchDeals();
});
