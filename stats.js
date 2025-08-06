// stats.js

import { db, ref, onValue } from "./firebase-config.js";

const statsList = document.getElementById("stats-list");

function groupByDay(history) {
  const result = {};
  for (const key in history) {
    const entry = history[key];
    const date = new Date(entry.timestamp).toLocaleDateString("cs-CZ");
    result[date] = result[date] || { total: 0, items: {} };

    entry.items.forEach(i => {
      if (!result[date].items[i.name]) {
        result[date].items[i.name] = { qty: 0, price: i.price };
      }
      result[date].items[i.name].qty += i.qty;
      result[date].total += i.qty * i.price;
    });
  }
  return result;
}

function renderStats(data) {
  statsList.innerHTML = "";
  const grouped = groupByDay(data);
  const dates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  dates.forEach(date => {
    const day = grouped[date];
    const div = document.createElement("div");
    div.classList.add("stats-day");
    div.innerHTML = `<h3>${date}</h3>`;

    const ul = document.createElement("ul");
    for (const name in day.items) {
      const i = day.items[name];
      const li = document.createElement("li");
      li.textContent = `${name}: ${i.qty}× (${i.price} Kč) = ${i.qty * i.price} Kč`;
      ul.appendChild(li);
    }

    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>Celkem za den:</strong> ${day.total} Kč`;
    div.appendChild(ul);
    div.appendChild(totalP);
    statsList.appendChild(div);
  });
}

function loadStats() {
  onValue(ref(db, "history"), (snapshot) => {
    const data = snapshot.val() || {};
    renderStats(data);
  });
}

loadStats();
