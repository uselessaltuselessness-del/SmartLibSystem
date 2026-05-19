// Client-side: sends DATA to Netlify functions
const DATA = [
  { name: "Alice", score: 10 },
  { name: "Bob", score: 20 }
];

async function saveData() {
  const res = await fetch("/.netlify/functions/saveData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: DATA, commitMessage: "Save DATA from site" })
  });
  const json = await res.json();
  document.getElementById("output").textContent = JSON.stringify(json, null, 2);
}

async function loadData() {
  const res = await fetch("/.netlify/functions/loadData");
  const json = await res.json();
  document.getElementById("output").textContent = JSON.stringify(json, null, 2);
}

document.getElementById("saveBtn").addEventListener("click", saveData);
document.getElementById("loadBtn").addEventListener("click", loadData);
