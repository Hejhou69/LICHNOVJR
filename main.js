import { db, ref, onValue, set, push } from "./firebase-config.js";

let products = [];
let sale = {};

const productListEl = document.getElementById("product-list");
const totalEl = document.getElementById("total");
const paidEl = document.getElementById("paid");
const changeEl = document.getElementById("change");

function renderProducts() {
  productListEl.innerHTML = "";
  products.forEach((p) => {
    sale[p.id] = sale[p.id] || 0;
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <div class="product-info">${p.name} (${p.price} Kč)</div>
      <div class="product-buttons">
        <button onclick="window.updateQuantity('${p.id}', -1)">–</button>
        <span class="qty" id="qty-${p.id}">${sale[p.id]}</span>
        <button onclick="window.updateQuantity('${p.id}', 1)">+</button>
      </div>
    `;
    productListEl.appendChild(div);
  });
  calculateTotal();
}

function updateQuantity(id, change) {
  sale[id] = (sale[id] || 0) + change;
  if (sale[id] < 0) sale[id] = 0;
  document.getElementById(`qty-${id}`).textContent = sale[id];
  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  products.forEach((p) => {
    total += p.price * (sale[p.id] || 0);
  });
  totalEl.textContent = total;
  const paid = Number(paidEl.value) || 0;
  changeEl.textContent = paid >= total ? paid - total : 0;
}

function saveSale() {
  const items = products
    .filter((p) => sale[p.id] > 0)
    .map((p) => ({ id: p.id, name: p.name, qty: sale[p.id], price: p.price }));

  if (items.length === 0) {
    alert("Nevybrali jste žádné produkty.");
    return;
  }

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const saleEntry = { timestamp: Date.now(), items, total };
  push(ref(db, "history"), saleEntry);

  alert("Prodej uložen.");
  resetSale();
}

function resetSale() {
  sale = {};
  paidEl.value = "";
  renderProducts();
}

function loadProducts() {
  onValue(ref(db, "products"), (snapshot) => {
    const data = snapshot.val();
    products = [];

    for (const id in data) {
      const item = data[id];
      products.push({
        id,
        name: item.name,
        price: item.price,
        order: item.order ?? 9999 // pokud není order, dáme vysoké číslo
      });
    }

    // Seřadíme produkty podle order
    products.sort((a, b) => a.order - b.order);

    renderProducts();
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

window.updateQuantity = updateQuantity;
window.saveSale = saveSale;
window.resetSale = resetSale;
window.toggleTheme = toggleTheme;

paidEl.addEventListener("input", calculateTotal);
loadProducts();

// Přepnutí režimu podle uloženého nastavení
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}
