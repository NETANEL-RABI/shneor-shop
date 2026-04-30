const products = [
    { id: 1, name: "ערכת יצירה 'סתיו צבעוני'", price: 45, img: "https://picsum.photos/seed/s1/500/500" },
    { id: 2, name: "לוח אותיות מגנטי", price: 120, img: "https://picsum.photos/seed/s2/500/500" },
    { id: 3, name: "מדבקות עידוד מעוצבות", price: 15, img: "https://picsum.photos/seed/s3/500/500" },
    { id: 4, name: "מארז חגי תשרי", price: 85, img: "https://picsum.photos/seed/s4/500/500" }
];

let cart = [];

function render() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col text-right">
            <img src="${p.img}" class="w-full h-48 object-cover rounded-2xl mb-4">
            <h3 class="font-bold text-lg mb-4 h-12">${p.name}</h3>
            <div class="mt-auto flex justify-between items-center flex-row-reverse">
                <span class="text-2xl font-black text-green-600">₪${p.price}</span>
                <button onclick="addToCart(${p.id})" class="bg-slate-900 text-white h-12 w-12 rounded-xl font-bold text-xl">+</button>
            </div>
        </div>
    `).join('');
}

window.toggleCart = function() {
    document.getElementById('side-cart').classList.toggle('show-cart');
};

window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateUI();
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartItemsDiv = document.getElementById('cart-items');
    
    cartItemsDiv.innerHTML = cart.map((item, index) => `
        <div class="flex justify-between items-center bg-white p-2 rounded-lg mb-2 border">
            <button onclick="removeFromCart(${index})" class="text-red-500 font-bold px-2">🗑️</button>
            <span class="text-sm font-bold">${item.name} - ₪${item.price}</span>
        </div>
    `).join('');
    
    document.getElementById('cart-total').innerText = `₪${total}`;
}

window.sendEmailOnly = function() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const itemsList = cart.map(i => i.name).join(", ");
    const total = document.getElementById('cart-total').innerText;

    if (!name || cart.length === 0) {
        alert("נא למלא שם ולהוסיף מוצרים לסל");
        return;
    }

    const subject = encodeURIComponent(`הזמנה חדשה: ${name}`);
    const body = encodeURIComponent(`שם: ${name}\nטלפון: ${phone}\nכתובת: ${address}\nמוצרים: ${itemsList}\nסה"כ: ${total}`);
    window.location.href = `mailto:s7176745@gmail.com?subject=${subject}&body=${body}`;
};

window.goToPaymentOnly = function() {
    if (cart.length === 0) {
        alert("הסל ריק");
        return;
    }
    window.location.href = "https://meshulam.co.il/pay/YOUR_LINK";
};

// הרצה ראשונית
window.onload = render;
