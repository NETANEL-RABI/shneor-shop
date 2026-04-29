const products = [
    { id: 1, name: "ערכת יצירה סתיו", price: 45, img: "https://picsum.photos/seed/1/300/200" },
    { id: 2, name: "לוח אותיות מגנטי", price: 120, img: "https://picsum.photos/seed/2/300/200" },
    { id: 3, name: "מדבקות עידוד", price: 15, img: "https://picsum.photos/seed/3/300/200" },
    { id: 4, name: "מארז חגי תשרי", price: 85, img: "https://picsum.photos/seed/4/300/200" }
];

let cart = [];

function render() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition">
            <img src="${p.img}" class="w-full h-40 object-cover rounded-lg mb-4">
            <h3 class="font-bold text-lg">${p.name}</h3>
            <p class="text-gray-600">מחיר: ₪${p.price}</p>
            <button onclick="addToCart(${p.id})" class="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition">+ הוספה לסל</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    itemsContainer.innerHTML = cart.map((item, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>${item.name}</span>
            <span class="font-bold">₪${item.price}</span>
        </div>
    `).join('');
}

function sendOrder() {
    if (cart.length === 0) return alert("הסל ריק!");
    let msg = "שלום שנאור, אני רוצה להזמין:\n" + cart.map(i => `- ${i.name} (₪${i.price})`).join('\n');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    msg += `\n\nסה"כ: ₪${total}`;
    window.open(`https://wa.me/972500000000?text=${encodeURIComponent(msg)}`);
}

render();
