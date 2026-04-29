const products = [
    { id: 1, name: "ערכת יצירה 'סתיו צבעוני'", originalPrice: 65, price: 45, category: "עונות", img: "https://picsum.photos/seed/s1/500/500" },
    { id: 2, name: "לוח אותיות מגנטי", originalPrice: 170, price: 120, category: "למידה", img: "https://picsum.photos/seed/s2/500/500" },
    { id: 3, name: "מדבקות עידוד מעוצבות", originalPrice: 22, price: 15, category: "קישוט", img: "https://picsum.photos/seed/s3/500/500" },
    { id: 4, name: "מארז חגי תשרי", originalPrice: 120, price: 85, category: "עונות", img: "https://picsum.photos/seed/s4/500/500" },
    { id: 5, name: "מספרי פלא - ערכת חשבון", originalPrice: 95, price: 65, category: "למידה", img: "https://picsum.photos/seed/s5/500/500" }
];

let cart = [];
let currentCategory = 'הכל';

// ניווט
window.showSection = function(section) {
    if(section === 'about') {
        document.getElementById('shop-section').classList.add('hidden');
        document.getElementById('about-section').classList.remove('hidden');
    } else {
        document.getElementById('about-section').classList.add('hidden');
        document.getElementById('shop-section').classList.remove('hidden');
    }
    window.scrollTo(0,0);
};

// חיפוש וסינון
window.filterProducts = function() {
    render();
};

window.filterByCategory = function(cat) {
    currentCategory = cat;
    // עדכון עיצוב הכפתורים
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.replace('bg-green-600', 'bg-slate-100');
        btn.classList.remove('text-white');
    });
    event.target.classList.replace('bg-slate-100', 'bg-green-600');
    event.target.classList.add('text-white');
    render();
};

function render() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const matchesCat = currentCategory === 'הכל' || p.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col text-right transition-all">
            <img src="${p.img}" class="w-full h-48 object-cover rounded-[1.5rem] mb-4">
            <h3 class="font-bold text-lg mb-4 h-12 overflow-hidden">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center flex-row-reverse">
                <div class="flex flex-col text-right">
                    <span class="text-slate-400 line-through text-xs">₪${p.originalPrice}</span>
                    <span class="text-2xl font-black text-green-600">₪${p.price}</span>
                </div>
                <button onclick="window.addToCart(${p.id}, this)" class="bg-slate-900 text-white h-12 w-12 rounded-2xl hover:bg-green-600 transition-colors font-bold text-xl">+</button>
            </div>
        </div>
    `).join('');
}

// עגלה
window.toggleCart = function() {
    document.getElementById('side-cart').classList.toggle('show-cart');
};

window.addToCart = function(id, btn) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
    if(btn) {
        btn.innerHTML = "✓";
        btn.classList.replace('bg-slate-900', 'bg-green-500');
        setTimeout(() => {
            btn.innerHTML = "+";
            btn.classList.replace('bg-green-500', 'bg-slate-900');
        }, 800);
    }
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div class="flex gap-4 bg-slate-50 p-3 rounded-2xl flex-row-reverse text-right items-center border border-slate-100">
            <img src="${item.img}" class="w-10 h-10 rounded-lg object-cover">
            <div class="flex-grow">
                <p class="font-bold text-xs">${item.name}</p>
                <p class="text-green-600 font-bold text-xs">₪${item.price}</p>
            </div>
            <button onclick="window.removeFromCart(${index})" class="text-red-300 hover:text-red-500">🗑️</button>
        </div>
    `).join('');
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateUI();
};

// פופ-אפ
window.closePromo = function() {
    document.getElementById('promo-modal').classList.remove('show-promo');
};

window.sendOrder = function() {
    if(cart.length === 0) return alert("הסל ריק!");
    const name = document.getElementById('customerName').value;
    if(!name) return alert("נא למלא שם גננת");
    let msg = `הזמנה משנאור\nגננת: ${name}\nסה"כ: ₪${cart.reduce((s,i)=>s+i.price,0)}\n`;
    cart.forEach(i => msg += `• ${i.name}\n`);
    window.open(`https://wa.me/972500000000?text=${encodeURIComponent(msg)}`);
};

window.onload = function() {
    render();
    setTimeout(() => {
        const promo = document.getElementById('promo-modal');
        if(promo) promo.classList.add('show-promo');
    }, 2000);
};
