import { db, ref, onValue } from "./firebase-config.js";

const statsEl = document.getElementById("stats-list");

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString("cs-CZ");
}

function renderStats(data) {
  statsEl.innerHTML = "";

  const statsByDate = {};

  const entries = Object.values(data || {});
  entries.forEach((entry) => {
    const date = formatDate(entry.timestamp);

    if (!statsByDate[date]) {
      statsByDate[date] = { total: 0, products: {} };
    }

    statsByDate[date].total += entry.total;

    entry.items.forEach((item) => {
      const key = item.name;
      if (!statsByDate[date].products[key]) {
        statsByDate[date].products[key] = 0;
      }
      statsByDate[date].products[key] += item.qty;
    });
  });

  const sortedDates = Object.keys(statsByDate).sort((a, b) => {
    const [da, ma, ya] = a.split(".").map(Number);
    const [db, mb, yb] = b.split(".").map(Number);
    return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da); // sestupně
  });

  if (sortedDates.length === 0) {
    statsEl.innerHTML = "<p>Žádná data ke zobrazení.</p>";
    return;
  }

  sortedDates.forEach((date) => {
    const { total, products } = statsByDate[date];
    const div = document.createElement("div");
    div.classList.add("stats-entry");

    const productList = Object.entries(products)
      .map(([name, qty]) => `<li>${qty}× ${name}</li>`)
      .join("");

    div.innerHTML = `
      <h3>📅 ${date}</h3>
      <p><strong>Celkem:</strong> ${total} Kč</p>
      <ul>${productList}</ul>
    `;
    statsEl.appendChild(div);
  });
}

function loadStats() {
  onValue(ref(db, "history"), (snapshot) => {
    const data = snapshot.val();
    renderStats(data);
  });
}

loadStats();
