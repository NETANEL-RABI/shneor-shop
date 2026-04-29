const products = [
    { id: 1, name: "ערכת יצירה 'סתיו צבעוני'", originalPrice: 65, price: 45, category: "עונות", desc: "ערכה מקיפה הכוללת 30 דפי עבודה וחומרי יצירה.", img: "https://picsum.photos/seed/s1/500/500" },
    { id: 2, name: "לוח אותיות מגנטי", originalPrice: 170, price: 120, category: "למידה", desc: "ערכת לימוד האותיות המבוקשת ביותר.", img: "https://picsum.photos/seed/s2/500/500" },
    { id: 3, name: "מדבקות עידוד מעוצבות", originalPrice: 22, price: 15, category: "קישוט", desc: "100 מדבקות עם משפטי העצמה לילדים.", img: "https://picsum.photos/seed/s3/500/500" }
];

let cart = [];
let currentCategory = 'הכל';

// ניווט בין דפים
window.showSection = function(section) {
    if(section === 'about') {
        document.getElementById('shop-section').classList.add('section-hidden');
        document.getElementById('about-section').classList.remove('section-hidden');
    } else {
        document.getElementById('about-section').classList.add('section-hidden');
        document.getElementById('shop-section').classList.remove('section-hidden');
    }
    window.scrollTo(0, 0);
};

function render() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    const filtered = products.filter(p => currentCategory === 'הכל' || p.category === currentCategory);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col relative text-right">
            <div class="relative overflow-hidden rounded-[1.5rem] mb-4">
                <img src="${p.img}" onclick="window.openModal(${p.id})" class="w-full h-48 object-cover cursor-pointer hover:scale-110 transition-transform">
                <div class="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">-30%</div>
            </div>
            <h3 class="font-bold text-lg mb-4 cursor-pointer" onclick="window.openModal(${p.id})">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center flex-row-reverse">
                <div class="flex flex-col">
                    <span class="text-slate-400 line-through text-xs">₪${p.originalPrice}</span>
                    <span class="text-2xl font-black text-green-600">₪${p.price}</span>
                </div>
                <button onclick="window.addToCart(${p.id}, this)" class="bg-slate-900 text-white h-10 w-10 flex items-center justify-center rounded-xl hover:bg-green-600">+</button>
            </div>
        </div>
    `).join('');
}

window.closePromo = function() { document.getElementById('promo-modal').classList.replace('modal-active', 'modal-hidden'); };

window.openModal = function(id) {
    const p = products.find(prod => prod.id === id);
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-desc').innerText = p.desc;
    document.getElementById('modal-old-price').innerText = `₪${p.originalPrice}`;
    document.getElementById('modal-price').innerText = `₪${p.price}`;
    document.getElementById('modal-img-container').style.background = `url('${p.img}') center/cover`;
    document.getElementById('modal-add-btn').onclick = () => { window.addToCart(p.id); window.closeModal(); };
    document.getElementById('product-modal').classList.replace('modal-hidden', 'modal-active');
};

window.closeModal = function() { document.getElementById('product-modal').classList.replace('modal-active', 'modal-hidden'); };

window.addToCart = function(id, btn = null) {
    cart.push(products.find(p => p.id === id));
    updateUI();
    if(btn) { btn.innerHTML = "✓"; setTimeout(() => btn.innerHTML = "+", 1000); }
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div class="flex gap-4 bg-slate-50 p-3 rounded-2xl flex-row-reverse text-right">
            <img src="${item.img}" class="w-12 h-12 rounded-lg object-cover">
            <div class="flex-grow"><p class="font-bold text-sm">${item.name}</p><p class="text-green-600 font-bold text-sm">₪${item.price}</p></div>
            <button onclick="window.removeFromCart(${index})" class="text-slate-300">🗑️</button>
        </div>
    `).join('');
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.removeFromCart = function(index) { cart.splice(index, 1); updateUI(); };
window.toggleCart = function() { document.getElementById('side-cart').classList.toggle('-translate-x-full'); };
window.filterByCategory = function(cat) { currentCategory = cat; render(); };

window.sendOrder = function(type) {
    if (cart.length === 0) return alert("הסל ריק!");
    const name = document.getElementById('customerName').value;
    if(!name) return alert("נא למלא שם");

    if(type === 'credit') {
        alert("מעבר לדף תשלום מאובטח... (כאן יחובר לינק מהספק של שנאור)");
        // window.location.href = "https://meshulam.co.il/pay/YOUR_ID"; 
    } else {
        let msg = `*הזמנה משנאור*\nגננת: ${name}\nסה"כ: ${document.getElementById('cart-total').innerText}\n`;
        cart.forEach(i => msg += `• ${i.name}\n`);
        window.open(`https://wa.me/972500000000?text=${encodeURIComponent(msg)}`);
    }
};

window.onload = function() {
    render();
    setTimeout(() => { document.getElementById('promo-modal').classList.replace('modal-hidden', 'modal-active'); }, 2000);
};
