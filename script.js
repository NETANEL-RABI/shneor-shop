const products = [
    { id: 1, name: "ערכת יצירה 'סתיו צבעוני'", originalPrice: 65, price: 45, img: "https://picsum.photos/seed/s1/500/500" },
    { id: 2, name: "לוח אותיות מגנטי", originalPrice: 170, price: 120, img: "https://picsum.photos/seed/s2/500/500" },
    { id: 3, name: "מדבקות עידוד מעוצבות", originalPrice: 22, price: 15, img: "https://picsum.photos/seed/s3/500/500" }
];

let cart = [];

// פונקציות גלובליות שחייבות לעבוד
window.showSection = function(section) {
    if(section === 'about') {
        document.getElementById('shop-section').classList.add('hidden');
        document.getElementById('about-section').classList.remove('hidden');
    } else {
        document.getElementById('about-section').classList.add('hidden');
        document.getElementById('shop-section').classList.remove('hidden');
    }
};

window.toggleCart = function() {
    const cartEl = document.getElementById('side-cart');
    cartEl.classList.toggle('translate-x-full');
};

window.closePromo = function() {
    document.getElementById('promo-modal').classList.add('hidden');
};

function render() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col text-right">
            <img src="${p.img}" class="w-full h-48 object-cover rounded-[1.5rem] mb-4">
            <h3 class="font-bold text-lg mb-4">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center flex-row-reverse">
                <div class="flex flex-col">
                    <span class="text-slate-400 line-through text-xs">₪${p.originalPrice}</span>
                    <span class="text-2xl font-black text-green-600">₪${p.price}</span>
                </div>
                <button onclick="addToCart(${p.id})" class="bg-slate-900 text-white h-10 w-10 rounded-xl">+</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div class="flex gap-4 bg-slate-50 p-3 rounded-2xl flex-row-reverse text-right text-sm">
            <div class="flex-grow font-bold">${item.name} - ₪${item.price}</div>
            <button onclick="removeFromCart(${index})" class="text-red-400">🗑️</button>
        </div>
    `).join('');
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateUI();
};

window.sendOrder = function() {
    const name = document.getElementById('customerName').value;
    if(!name) return alert("נא למלא שם גננת");
    let msg = `הזמנה משנאור\nגננת: ${name}\nסה"כ: ₪${cart.reduce((s,i)=>s+i.price,0)}\n`;
    cart.forEach(i => msg += `• ${i.name}\n`);
    window.open(`https://wa.me/972500000000?text=${encodeURIComponent(msg)}`);
};

// הפעלה בטעינה
window.onload = function() {
    render();
    setTimeout(() => {
        document.getElementById('promo-modal').classList.remove('hidden');
        document.getElementById('promo-modal').classList.add('modal-active');
    }, 2000);
};
