const products = [
    { id: 1, name: "ערכת יצירה 'סתיו צבעוני'", price: 45, category: "עונות", desc: "ערכה מקיפה הכוללת 30 דפי עבודה, מדבקות סתיו וחומרי יצירה מהטבע.", img: "https://picsum.photos/seed/s1/500/500" },
    { id: 2, name: "לוח אותיות מגנטי", price: 120, category: "למידה", desc: "ערכת לימוד האותיות המבוקשת ביותר. מגנטים חזקים וצבעוניים ללוח הגן.", img: "https://picsum.photos/seed/s2/500/500" },
    { id: 3, name: "מדבקות עידוד מעוצבות", price: 15, category: "קישוט", desc: "100 מדבקות עם משפטי העצמה לילדים בעיצוב נקי ומודרני.", img: "https://picsum.photos/seed/s3/500/500" },
    { id: 4, name: "מארז חגי תשרי", price: 85, category: "עונות", desc: "כל מה שצריך לחגים בערכה אחת: סמלי חג, קישוטים לסוכה ודפי הסבר.", img: "https://picsum.photos/seed/s4/500/500" },
    { id: 5, name: "מספרי פלא - ערכת חשבון", price: 65, category: "למידה", desc: "לימוד מספרים וכמויות דרך משחק והנאה. מתאים לגילאי 3-6.", img: "https://picsum.photos/seed/s5/500/500" }
];

let cart = [];
let currentCategory = 'הכל';

// רינדור גריד המוצרים
function render() {
    const grid = document.getElementById('product-grid');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const matchesCat = currentCategory === 'הכל' || p.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    grid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col transition-all duration-300">
            <img src="${p.img}" onclick="window.openModal(${p.id})" class="w-full h-48 object-cover rounded-[1.5rem] mb-4 cursor-pointer">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full text-slate-500 uppercase">${p.category}</span>
            </div>
            <h3 class="font-bold text-lg mb-4 leading-tight cursor-pointer" onclick="window.openModal(${p.id})">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center">
                <span class="text-2xl font-black">₪${p.price}</span>
                <button onclick="window.addToCart(${p.id}, this)" class="bg-slate-900 text-white h-10 w-10 flex items-center justify-center rounded-xl hover:bg-green-600 transition-colors shadow-lg">
                    +
                </button>
            </div>
        </div>
    `).join('');
}

// ניהול חלון פרטי מוצר
window.openModal = function(id) {
    const p = products.find(prod => prod.id === id);
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-desc').innerText = p.desc;
    document.getElementById('modal-category').innerText = p.category;
    document.getElementById('modal-price').innerText = `₪${p.price}`;
    document.getElementById('modal-img-container').style.background = `url('${p.img}') center/cover`;
    document.getElementById('modal-add-btn').onclick = () => { window.addToCart(p.id); window.closeModal(); };
    document.getElementById('product-modal').classList.add('modal-active');
};

window.closeModal = function() {
    document.getElementById('product-modal').classList.remove('modal-active');
};

// ניהול עגלה
window.addToCart = function(id, btn = null) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
    
    if(btn) {
        btn.innerHTML = "✓";
        btn.classList.replace('bg-slate-900', 'bg-green-500');
        setTimeout(() => { btn.innerHTML = "+"; btn.classList.replace('bg-green-500', 'bg-slate-900'); }, 1000);
    }
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsEl = document.getElementById('cart-items');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    itemsEl.innerHTML = cart.map((item, index) => `
        <div class="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <img src="${item.img}" class="w-12 h-12 rounded-lg object-cover">
            <div class="flex-grow">
                <p class="font-bold text-sm leading-none mb-1">${item.name}</p>
                <p class="text-green-600 font-bold italic text-sm">₪${item.price}</p>
            </div>
            <button onclick="window.removeFromCart(${index})" class="text-slate-300 hover:text-red-500 transition">🗑️</button>
        </div>
    `).join('');
    
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateUI();
};

window.toggleCart = function() {
    document.getElementById('side-cart').classList.toggle('-translate-x-full');
};

window.filterByCategory = function(cat) {
    currentCategory = cat;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.replace('bg-green-600', 'bg-slate-100');
        btn.classList.remove('text-white');
    });
    event.target.classList.replace('bg-slate-100', 'bg-green-600');
    event.target.classList.add('text-white');
    render();
};

window.filterProducts = render;

window.sendOrder = function() {
    if (cart.length === 0) return alert("הסל ריק!");
    const name = document.getElementById('customerName').value;
    const garden = document.getElementById('gardenName').value;
    if(!name || !garden) return alert("נא למלא שם ושם הגן");

    let msg = `*הזמנה חדשה - החנות של שנאור*\n`;
    msg += `גננת: ${name} | גן: ${garden}\n`;
    msg += `--------------------------\n`;
    cart.forEach(i => msg += `• ${i.name} - ₪${i.price}\n`);
    msg += `--------------------------\n`;
    msg += `*סה"כ לתשלום: ${document.getElementById('cart-total').innerText}*`;
    
    window.open(`https://wa.me/972500000000?text=${encodeURIComponent(msg)}`);
};

document.addEventListener('DOMContentLoaded', render);
