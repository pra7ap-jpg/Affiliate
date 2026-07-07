let allProducts = [];
let activeCategory = 'All';

// 1. Fetch Deals
function fetchDeals() {
    // IMPORTANT: Paste your "Publish to Web" CSV link here, NOT the /exec webhook link
    const sheetCsvUrl = 'YOUR_PUBLISHED_CSV_LINK_HERE'; 
    
    const freshUrl = sheetCsvUrl + (sheetCsvUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

    fetch(freshUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    // Reverse the array so the newest deals show up first
                    allProducts = results.data.reverse(); 
                    renderFilters();
                    applyFilters();
                }
            });
        })
        .catch(err => {
            console.error("Error fetching deals:", err);
            const grid = document.getElementById('productsGrid');
            if(grid) grid.innerHTML = '<div style="color: #f8fafc; text-align: center; width: 100%;">Failed to load deals.</div>';
        });
}

// 2. Setup Category Filters
function renderFilters() {
    const filterContainer = document.getElementById('filterContainer');
    if (!filterContainer) return;

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

// 4. Apply Filters
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
        grid.innerHTML = '<div style="color: #94a3b8; grid-column: 1 / -1; text-align: center;">No deals found for this category.</div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        // Fallbacks in case a cell in the spreadsheet is empty
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

// Initialize when the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    fetchDeals();
});
