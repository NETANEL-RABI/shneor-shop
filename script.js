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
    document.getElementById('shop-section').classList.toggle('hidden', section === 'about');
    document.getElementById('about-section').classList.toggle('hidden', section === 'shop');
    window.scrollTo(0,0);
};

window.filterProducts = function() { render(); };

window.filterByCategory = function(cat) {
    currentCategory = cat;
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
                <button onclick="window.addToCart(${p.id}, this)" class="bg-slate-900 text-white h-12 w-12 rounded-2xl font-bold text-xl">+</button>
            </div>
        </div>
    `).join('');
}

// עגלה ותשלום
window.toggleCart = function() { document.getElementById('side-cart').classList.toggle('show-cart'); };

window.addToCart = function(id, btn) {
    cart.push(products.find(p => p.id === id));
    updateUI();
    if(btn) {
        btn.innerHTML = "✓"; btn.classList.replace('bg-slate-900', 'bg-green-500');
        setTimeout(() => { btn.innerHTML = "+"; btn.classList.replace('bg-green-500', 'bg-slate-900'); }, 800);
    }
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div class="flex justify-between items-center bg-white p-2 rounded-lg mb-2 text-xs border">
            <span>${item.name} - ₪${item.price}</span>
            <button onclick="window.removeFromCart(${index})" class="text-red-400">🗑️</button>
        </div>
    `).join('');
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.removeFromCart = function(index) { cart.splice(index, 1); updateUI(); };

window.handleOrder = function() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const total = cart.reduce((s, i) => s + i.price, 0);

    if (!name || !phone || !address) return alert("נא למלא את כל פרטי המשלוח");
    if (cart.length === 0) return alert("הסל ריק");

    const itemsList = cart.map(i => i.name).join(", ");
    const mailTo = "s7176745@gmail.com";
    const subject = encodeURIComponent(`הזמנה חדשה משנאור: ${name}`);
    const body = encodeURIComponent(`פרטי לקוח:\nשם: ${name}\nטלפון: ${phone}\nכתובת: ${address}\n\nמוצרים:\n${itemsList}\n\nסה"כ לתשלום: ₪${total}`);

    // פתיחת מייל
    window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;

    // מעבר לתשלום אחרי השליחה
    setTimeout(() => {
        if(confirm("האם המייל נשלח? לחצי אישור למעבר לתשלום באשראי")) {
            window.location.href = "https://meshulam.co.il/pay/YOUR_LINK"; // תחליף בלינק האמיתי שלך
        }
    }, 1500);
};

window.closePromo = function() { document.getElementById('promo-modal').classList.remove('show-promo'); };

window.onload = function() {
    render();
    setTimeout(() => { document.getElementById('promo-modal').classList.add('show-promo'); }, 2000);
};
