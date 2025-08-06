// history.js

import { db, ref, onValue } from "./firebase-config.js";

const historyList = document.getElementById("history-list");

function renderHistory(data) {
  historyList.innerHTML = "";
  const entries = Object.entries(data || {}).sort((a, b) => b[1].timestamp - a[1].timestamp);

  for (const [id, entry] of entries) {
    const div = document.createElement("div");
    const date = new Date(entry.timestamp).toLocaleString();
    const products = entry.items.map(i => `${i.name} × ${i.qty}`).join(", ");
    div.classList.add("history-entry");
    div.innerHTML = `
      <p><strong>${date}</strong><br>
      ${products}<br>
      <strong>Celkem:</strong> ${entry.total} Kč</p>
    `;
    historyList.appendChild(div);
  }
}

function loadHistory() {
  onValue(ref(db, "history"), (snapshot) => {
    const data = snapshot.val();
    renderHistory(data);
  });
}

loadHistory();
