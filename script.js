const products = [
    { id: 1, name: "ערכת יצירה 'סתיו צבעוני'", originalPrice: 65, price: 45, category: "עונות", img: "https://picsum.photos/seed/s1/500/500" },
    { id: 2, name: "לוח אותיות מגנטי", originalPrice: 170, price: 120, category: "למידה", img: "https://picsum.photos/seed/s2/500/500" },
    { id: 3, name: "מדבקות עידוד מעוצבות", originalPrice: 22, price: 15, category: "קישוט", img: "https://picsum.photos/seed/s3/500/500" },
    { id: 4, name: "מארז חגי תשרי", originalPrice: 120, price: 85, category: "עונות", img: "https://picsum.photos/seed/s4/500/500" },
    { id: 5, name: "מספרי פלא - ערכת חשבון", originalPrice: 95, price: 65, category: "למידה", img: "https://picsum.photos/seed/s5/500/500" }
];

let cart = [];
let currentCategory = 'הכל';

// ניווט וסינון
window.showSection = function(section) {
    const shop = document.getElementById('shop-section');
    const about = document.getElementById('about-section');
    if (section === 'about') {
        shop.classList.add('hidden');
        about.classList.remove('hidden');
    } else {
        about.classList.add('hidden');
        shop.classList.remove('hidden');
    }
    window.scrollTo(0, 0);
};

window.filterProducts = function() { render(); };

window.filterByCategory = function(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.replace('bg-green-600', 'bg-slate-100');
        btn.classList.remove('text-white');
    });
    if (event && event.target) {
        event.target.classList.replace('bg-slate-100', 'bg-green-600');
        event.target.classList.add('text-white');
    }
    render();
};

function render() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => (currentCategory === 'הכל' || p.category === currentCategory) && p.name.toLowerCase().includes(searchTerm));

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col text-right">
            <img src="${p.img}" class="w-full h-48 object-cover rounded-[1.5rem] mb-4">
            <h3 class="font-bold text-lg mb-4 h-12 overflow-hidden">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center flex-row-reverse">
                <div class="flex flex-col">
                    <span class="text-slate-400 line-through text-[10px]">₪${p.originalPrice}</span>
                    <span class="text-2xl font-black text-green-600">₪${p.price}</span>
                </div>
                <button onclick="window.addToCart(${p.id}, this)" class="bg-slate-900 text-white h-12 w-12 rounded-2xl font-bold text-xl hover:bg-green-600 transition-all">+</button>
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
    if (btn) {
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
    const cartItemsDiv = document.getElementById('cart-items');
    
    cartItemsDiv.innerHTML = cart.map((item, index) => `
        <div class="flex justify-between items-center bg-white p-2 rounded-lg mb-2 text-xs border border-slate-100">
            <button onclick="window.removeFromCart(${index})" class="text-red-400 font-bold px-2">🗑️</button>
            <span class="font-bold text-right">${item.name} - ₪${item.price}</span>
        </div>
    `).join('');
    
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateUI();
};

// פונקציית התשלום והמייל
window.handleOrder = function() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const total = cart.reduce((s, i) => s + i.price, 0);

    if (!name || !phone || !address) {
        alert("נא למלא את כל פרטי המשלוח (שם, טלפון וכתובת)");
        return;
    }
    if (cart.length === 0) {
        alert("הסל שלך ריק");
        return;
    }

    const itemsList = cart.map(i => i.name).join(", ");
    const mailTo = "s7176745@gmail.com";
    const subject = encodeURIComponent(`הזמנה חדשה משנאור: ${name}`);
    const body = encodeURIComponent(
        `פרטי לקוח:\n` +
        `שם: ${name}\n` +
        `טלפון: ${phone}\n` +
        `כתובת: ${address}\n\n` +
        `מוצרים שהוזמנו:\n${itemsList}\n\n` +
        `סה"כ לתשלום: ₪${total}`
    );

    // פתיחת אפליקציית המייל
    window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;

    // מעבר לתשלום (משיולם/קארדקום) לאחר השהייה
    setTimeout(() => {
        if(confirm("האם המייל נשלח? לחצי 'אישור' כדי לעבור לדף התשלום המאובטח")) {
            window.location.href = "https://meshulam.co.il/pay/YOUR_LINK"; // שים פה את הלינק שלך
        }
    }, 1500);
};

window.closePromo = function() {
    document.getElementById('promo-modal').classList.remove('show-promo');
};

window.onload = function() {
    render();
    setTimeout(() => {
        const promo = document.getElementById('promo-modal');
        if (promo) promo.classList.add('show-promo');
    }, 2000);
};
