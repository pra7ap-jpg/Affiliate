let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/deals')
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
        .catch(err => {
            document.getElementById('productsGrid').innerHTML = '<div class="loading">Failed to load deals.</div>';
        });

    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => {
            const title = p.Title ? p.Title.toLowerCase() : '';
            const category = p.Category ? p.Category.toLowerCase() : '';
            return title.includes(term) || category.includes(term);
        });
        renderProducts(filtered);
    });
});

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">No products found.</div>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${product.ImageURL || ''}" alt="${product.Title || 'Product Image'}">
            </div>
            <div class="card-content">
                <div class="card-category">${product.Platform || 'Deal'}</div>
                <h3 class="card-title">${product.Title || 'Untitled Product'}</h3>
                <div class="card-footer">
                    <div class="price-tag">${product.Price || ''}</div>
                    <a href="${product.AffiliateLink || '#'}" target="_blank" class="btn">Grab Deal</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}
