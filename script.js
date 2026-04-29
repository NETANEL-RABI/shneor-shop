// רשימת מוצרים
const products = [
    { id: 1, name: "ערכת יצירה סתיו", price: 45, category: "עונות", img: "https://picsum.photos/seed/1/400/300" },
    { id: 2, name: "לוח אותיות מגנטי", price: 120, category: "למידה", img: "https://picsum.photos/seed/2/400/300" },
    { id: 3, name: "מדבקות עידוד מעוצבות", price: 15, category: "קישוט", img: "https://picsum.photos/seed/3/400/300" },
    { id: 4, name: "מארז חגי תשרי", price: 85, category: "עונות", img: "https://picsum.photos/seed/4/400/300" }
];

let cart = [];
let currentCategory = 'הכל';

// פונקציית הרינדור - מוודאת שהאלמנט קיים לפני שהיא רצה
function renderProducts(filterText = '') {
    const grid = document.getElementById('product-grid');
    if (!grid) return; // הגנה למקרה שהאלמנט עוד לא נטען

    const filtered = products.filter(p => {
        const matchesSearch = p.name.includes(filterText);
        const matchesCategory = currentCategory === 'הכל' || p.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col p-4">
            <img src="${p.img}" class="w-full h-40 object-cover rounded-lg mb-4">
            <h3 class="font-bold text-lg mb-2">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold">₪${p.price}</span>
                <button onclick="addToCart(${p.id})" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                    הוספה
                </button>
            </div>
        </div>
    `).join('');
}

// פונקציות גלובליות כדי שה-HTML יזהה אותן
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
};

window.toggleCart = function() {
    const cartEl = document.getElementById('side-cart');
    cartEl.classList.toggle('-translate-x-full');
};

window.filterByCategory = function(cat) {
    currentCategory = cat;
    renderProducts();
};

window.filterProducts = function() {
    const text = document.getElementById('searchInput').value;
    renderProducts(text);
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    
    itemsContainer.innerHTML = cart.map((item, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-2 rounded mb-2">
            <span class="text-sm">${item.name}</span>
            <button onclick="removeFromCart(${index})" class="text-red-500">×</button>
        </div>
    `).join('');
    
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateUI();
};

window.sendOrder = function() {
    if (cart.length === 0) return alert("הסל ריק");
    const name = document.getElementById('customerName').value || "גננת";
    let msg = `הזמנה מ${name}:\n` + cart.map(i => i.name).join('\n');
    window.open(`https://wa.me/972500000000?text=${encodeURIComponent(msg)}`);
};

// הרצה ראשונית רק כשהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
