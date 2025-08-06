import { db, ref, onValue, set, remove, update } from "./firebase-config.js";

const productListEl = document.getElementById("product-list");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");

let products = {};

function renderProducts() {
  const productArray = Object.entries(products)
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  productListEl.innerHTML = "";
  productArray.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <span>${p.name} (${p.price} Kč)</span>
      <div>
        <button onclick="window.moveProduct('${p.id}', -1)">🔼</button>
        <button onclick="window.moveProduct('${p.id}', 1)">🔽</button>
        <button onclick="window.deleteProduct('${p.id}')">🗑️</button>
      </div>
    `;
    productListEl.appendChild(div);
  });
}

function loadProducts() {
  onValue(ref(db, "products"), (snapshot) => {
    products = snapshot.val() || {};
    renderProducts();
  });
}

function addProduct() {
  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  if (!name || !price) {
    alert("Zadejte název a cenu.");
    return;
  }

  const id = name.toLowerCase().replace(/\s+/g, "_") + Date.now();
  const order = Date.now(); // čas použijeme jako pořadí

  set(ref(db, `products/${id}`), { name, price, order });

  nameInput.value = "";
  priceInput.value = "";
}

function deleteProduct(id) {
  if (confirm("Opravdu smazat tento produkt?")) {
    remove(ref(db, `products/${id}`));
  }
}

function moveProduct(id, direction) {
  const productArray = Object.entries(products)
    .map(([key, p]) => ({ id: key, ...p }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const index = productArray.findIndex((p) => p.id === id);
  const newIndex = index + direction;

  if (newIndex < 0 || newIndex >= productArray.length) return;

  // Swap orders
  const prodA = productArray[index];
  const prodB = productArray[newIndex];

  const updates = {};
  updates[`products/${prodA.id}/order`] = prodB.order;
  updates[`products/${prodB.id}/order`] = prodA.order;

  update(ref(db), updates);
}

window.addProduct = addProduct;
window.deleteProduct = deleteProduct;
window.moveProduct = moveProduct;

loadProducts();
