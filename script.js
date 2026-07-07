// Global State
let allProducts = [];
let currentCategory = 'All';

// 1. Fetch Deals with Cache Buster
function fetchDeals() {
    // The '?t=' + timestamp forces the browser to bypass its cache and pull a fresh copy
    const freshUrl = '/api/deals?t=' + new Date().getTime();

    fetch(freshUrl)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
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
            if(grid) {
                grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; font-weight: 700;">Failed to load deals. Please refresh the page.</div>';
            }
        });
}

// 2. Render Category Filters Dynamically
function renderFilters() {
    const filterContainer = document.getElementById('filters');
    if (!filterContainer) return;
    
    // Extract unique categories from the spreadsheet data
    const categories = ['All', ...new Set(allProducts.map(p => p.Category).filter(Boolean))];
    
    filterContainer.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category;
        // Keep the styling classes for your UI
        btn.className = currentCategory === category ? 'active' : ''; 
        
        btn.onclick = () => {
            currentCategory = category;
            renderFilters(); // Re-render to update the visual 'active' state
            applyFilters();  // Update the grid
        };
        
        filterContainer.appendChild(btn);
    });
}

// 3. Apply Filters and Render the Products Grid
function applyFilters() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear current grid
    
    // Filter the products array based on the selected category
    const filteredProducts = currentCategory === 'All' 
        ? allProducts 
        : allProducts.filter(p => p.Category === currentCategory);

    // Empty state handling
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; font-weight: 700;">No deals found in this category.</div>';
        return;
    }

    // Build the HTML for each product card
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card'; // Matches your CSS
        
        // Map the variables exactly to your Google Sheet column headers
        const title = product.Title || 'Untitled Deal';
        const price = product.Price || '';
        const oldPrice = product.OldPrice || '';
        const imageUrl = product.ImageURL || '';
        const link = product.AffiliateLink || '#';
        const platform = product.Platform || 'Store';

        // Construct the card HTML
        card.innerHTML = `
            <img src="${imageUrl}" alt="${title}" class="product-image" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            <div class="product-details">
                <h3 class="product-title">${title}</h3>
                <div class="price-container">
                    <span class="price">${price}</span>
                    ${oldPrice ? `<span class="old-price">${oldPrice}</span>` : ''}
                </div>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="buy-btn">
                    Grab Deal on ${platform}
                </a>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// 4. Initialize App when the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    fetchDeals();
});
