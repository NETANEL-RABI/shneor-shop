// רשימת המוצרים - כאן מוסיפים או משנים מוצרים
const products = [
    { id: 1, name: "ערכת יצירה 'סתיו'", price: 45, category: "עונות", img: "https://picsum.photos/seed/s1/500/500" },
    { id: 2, name: "לוח אותיות מגנטי", price: 120, category: "למידה", img: "https://picsum.photos/seed/s2/500/500" },
    { id: 3, name: "מדבקות עידוד", price: 15, category: "קישוט", img: "https://picsum.photos/seed/s3/500/500" },
    { id: 4, name: "מארז חגי תשרי", price: 85, category: "עונות", img: "https://picsum.photos/seed/s4/500/500" },
    { id: 5, name: "חשבון בכיף", price: 65, category: "למידה", img: "https://picsum.photos/seed/s5/500/500" }
];

let cart = []; // מערך ריק שיכיל את המוצרים שהלקוח בחר
let currentCategory = 'הכל'; // משתנה למעקב אחרי הסינון הנוכחי

// פונקציה שמציגה את המוצרים על המסך (כולל חיפוש וסינון)
window.render = function() {
    const grid = document.getElementById('product-grid');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // סינון הרשימה לפי קטגוריה ולפי מילת חיפוש
    const filtered = products.filter(p => {
        const matchesCategory = (currentCategory === 'הכל' || p.category === currentCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    // יצירת הקוד של כרטיסי המוצר
    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col text-right">
            <img src="${p.img}" class="w-full h-48 object-cover rounded-[1.5rem] mb-4">
            <h3 class="font-bold text-lg mb-4 h-12 overflow-hidden">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center flex-row-reverse">
                <span class="text-2xl font-black text-green-600">₪${p.price}</span>
                <button onclick="window.addToCart(${p.id})" class="bg-slate-900 text-white h-12 w-12 rounded-2xl font-bold text-xl hover:bg-green-600 transition-all">+</button>
            </div>
        </div>
    `).join('');
};

// שינוי קטגוריה בלחיצה על כפתור
window.filterByCategory = function(cat) {
    currentCategory = cat;
    // עדכון המראה של הכפתורים (מי נבחר)
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-green-600', 'text-white');
        btn.classList.add('bg-slate-100');
    });
    event.target.classList.replace('bg-slate-100', 'bg-green-600');
    event.target.classList.add('text-white');
    window.render();
};

// פתיחה וסגירה של העגלה
window.toggleCart = function() {
    document.getElementById('side-cart').classList.toggle('show-cart');
};

// הוספת מוצר לעגלה
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    window.updateUI();
};

// הסרת מוצר מהעגלה
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    window.updateUI();
};

// עדכון המראה של העגלה (כמות וסה"כ)
window.updateUI = function() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartItemsDiv = document.getElementById('cart-items');
    
    cartItemsDiv.innerHTML = cart.map((item, index) => `
        <div class="flex justify-between items-center bg-white p-2 rounded-lg mb-2 border border-slate-50">
            <button onclick="window.removeFromCart(${index})" class="text-red-500 text-xs">🗑️</button>
            <span class="text-sm font-bold">${item.name} - ₪${item.price}</span>
        </div>
    `).join('');
    
    document.getElementById('cart-total').innerText = `₪${total}`;
};

// טיפול בשליחת הזמנה (וואטסאפ או מייל)
window.handleOrder = function(method) {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const itemsList = cart.map(i => i.name).join(", ");
    const total = document.getElementById('cart-total').innerText;

    if (!name || cart.length === 0) {
        alert("נא למלא שם ולהוסיף מוצרים");
        return;
    }

    if (method === 'whatsapp') {
        const text = `שלום שנאור, הזמנה חדשה:\nשם: ${name}\nטלפון: ${phone}\nכתובת: ${address}\nמוצרים: ${itemsList}\nסה"כ: ${total}`;
        window.open(`https://wa.me/972527176745?text=${encodeURIComponent(text)}`, '_blank');
    } else {
        const subject = encodeURIComponent(`הזמנה חדשה: ${name}`);
        const body = encodeURIComponent(`שם: ${name}\nטלפון: ${phone}\nכתובת: ${address}\nמוצרים: ${itemsList}\nסה"כ: ${total}`);
        window.location.href = `mailto:s7176745@gmail.com?subject=${subject}&body=${body}`;
    }
};

// מעבר לדף התשלום של משולם
window.goToPaymentOnly = function() {
    if (cart.length === 0) { alert("הסל ריק"); return; }
    window.location.href = "https://meshulam.co.il/pay/YOUR_LINK";
};

// הפעלת החנות מיד עם טעינת הדף
window.onload = window.render;
