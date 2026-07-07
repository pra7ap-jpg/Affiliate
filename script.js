// PASTE YOUR PUBLISHED GOOGLE SHEET CSV LINK HERE:
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGy1ecJ96nFNxjc-PvOY4RC3HhwC8AYYTLG9MKUaTBgudoFLKgg5odzFMgMWA5-CIaNHIfXynI8kxq/pub?gid=0&single=true&output=csv';

let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    // Setup Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => 
            p.Title.toLowerCase().includes(searchTerm) || 
            p.Category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filtered);
    });
});

function fetchProducts() {
    fetch(SHEET_CSV_URL)
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
        .catch(error => {
            document.getElementById('productsGrid').innerHTML = '<p>Error loading deals.</p>';
            console.error('Error fetching data:', error);
        });
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = ''; // Clear loading text

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1;">No products found.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="img-wrapper">
                <span class="platform-badge">${product.Platform || 'Deal'}</span>
                <img src="${product.ImageURL}" alt="${product.Title}">
            </div>
            <div class="card-info">
                <span class="category">${product.Category}</span>
                <h3>${product.Title}</h3>
                <div class="footer">
                    <div>
                        <span class="price">${product.Price}</span>
                        ${product.OldPrice ? `<span class="old-price">${product.OldPrice}</span>` : ''}
                    </div>
                    <a href="${product.AffiliateLink}" target="_blank" rel="noopener noreferrer" class="buy-btn">Get Deal</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}
