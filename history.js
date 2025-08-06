import { db, ref, onValue } from "./firebase-config.js";

const historyListEl = document.getElementById("history-list");

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString("cs-CZ") + " " + d.toLocaleTimeString("cs-CZ");
}

function renderHistory(data) {
  historyListEl.innerHTML = "";

  const entries = Object.values(data || {}).sort((a, b) => b.timestamp - a.timestamp);

  if (entries.length === 0) {
    historyListEl.innerHTML = "<p>Žádná historie není k dispozici.</p>";
    return;
  }

  entries.forEach((entry) => {
    const div = document.createElement("div");
    div.classList.add("history-entry");

    const date = formatDate(entry.timestamp);
    const total = entry.total;

    const itemsList = entry.items.map(i => 
      `<li>${i.qty}× ${i.name} (${i.price} Kč)</li>`
    ).join("");

    div.innerHTML = `
      <h3>${date}</h3>
      <ul>${itemsList}</ul>
      <p><strong>Celkem:</strong> ${total} Kč</p>
    `;

    historyListEl.appendChild(div);
  });
}

function loadHistory() {
  onValue(ref(db, "history"), (snapshot) => {
    const data = snapshot.val();
    renderHistory(data);
  });
}

loadHistory();
