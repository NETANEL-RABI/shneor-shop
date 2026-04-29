const products = [
    { id: 1, name: "ערכת יצירה סתיו", price: 45, category: "עונות", img: "https://picsum.photos/seed/1/400/300" },
    { id: 2, name: "לוח אותיות מגנטי", price: 120, category: "למידה", img: "https://picsum.photos/seed/2/400/300" },
    { id: 3, name: "מדבקות עידוד מעוצבות", price: 15, category: "קישוט", img: "https://picsum.photos/seed/3/400/300" },
    { id: 4, name: "מארז חגי תשרי", price: 85, category: "עונות", img: "https://picsum.photos/seed/4/400/300" },
    { id: 5, name: "ערכת מספרים לגן", price: 60, category: "למידה", img: "https://picsum.photos/seed/5/400/300" }
];

let cart = [];
let currentCategory = 'הכל';

// הצגת מוצרים עם פילטרים
function renderProducts(filterText = '') {
    const grid = document.getElementById('product-grid');
    const filtered = products.filter(p => {
        const matchesSearch = p.name.includes(filterText);
        const matchesCategory = currentCategory === 'הכל' || p.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    grid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            <div class="relative">
                <img src="${p.img}" class="w-full h-48 object-cover">
                <span class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">${p.category}</span>
            </div>
            <div class="p-5 flex-grow flex flex-col">
                <h3 class="text-lg font-bold mb-2">${p.name}</h3>
                <div class="mt-auto flex justify-between items-center">
                    <span class="text-2xl font-black text-gray-900">₪${p.price}</span>
                    <button onclick="addToCart(${p.id})" class="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition shadow-md px-4">
                        + הוספה
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// פונקציות חיפוש וסינון
function filterProducts() {
    const text = document.getElementById('searchInput').value;
    renderProducts(text);
}

function filterByCategory(cat) {
    currentCategory = cat;
    renderProducts();
}

// ניהול עגלה
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
    // אנימציה קטנה של העגלה
    const cartBtn = document.querySelector('nav span.text-3xl');
    cartBtn.classList.add('scale-125', 'text-green-500');
    setTimeout(() => cartBtn.classList.remove('scale-125', 'text-green-500'), 300);
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    
    itemsContainer.innerHTML = cart.map((item, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div>
                <p class="font-bold text-sm">${item.name}</p>
                <p class="text-green-600 font-bold italic">₪${item.price}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 text-xl">&times;</button>
        </div>
    `).join('');
    
    document.getElementById('cart-total').innerText = `₪${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateUI();
}

function toggleCart() {
    document.getElementById('side-cart').classList.toggle('-translate-x-full');
}

// שליחה לוואטסאפ עם פרטי הלקוח
function sendOrder() {
    if (cart.length === 0) return alert("הסל שלך ריק!");
    const name = document.getElementById('customerName').value;
    const garden = document.getElementById('gardenName').value;
    
    if (!name || !garden) return alert("בבקשה מלאי שם ושם הגן כדי ששנאור ידע למי לחזור");

    let msg = `*הזמנה חדשה מהאתר*\n`;
    msg += `--------------------------\n`;
    msg += `👤 גננת: ${name}\n`;
    msg += `🏫 גן: ${garden}\n`;
    msg += `--------------------------\n`;
    msg += `*המוצרים:*\n`;
    cart.forEach(i => msg += `• ${i.name} (₪${i.price})\n`);
    msg += `\n*סה"כ לתשלום: ${document.getElementById('cart-total').innerText}*`;
    
    // החלף כאן את ה-0000 במספר האמיתי של שנאור
    window.open(`https://wa.me/972500000000?text=${encodeURIComponent(msg)}`);
}

renderProducts();
