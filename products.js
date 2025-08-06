// products.js

import { db, ref, onValue, set, remove } from "./firebase-config.js";

const productListEl = document.getElementById("product-list");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");

function renderProducts(products) {
  productListEl.innerHTML = "";
  for (const id in products) {
    const p = products[id];
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <span>${p.name} (${p.price} Kč)</span>
      <button onclick="window.deleteProduct('${id}')">🗑️</button>
    `;
    productListEl.appendChild(div);
  }
}

function loadProducts() {
  onValue(ref(db, "products"), (snapshot) => {
    const data = snapshot.val() || {};
    renderProducts(data);
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
  set(ref(db, `products/${id}`), { name, price });
  nameInput.value = "";
  priceInput.value = "";
}

function deleteProduct(id) {
  if (confirm("Opravdu smazat tento produkt?")) {
    remove(ref(db, `products/${id}`));
  }
}

window.addProduct = addProduct;
window.deleteProduct = deleteProduct;

loadProducts();
