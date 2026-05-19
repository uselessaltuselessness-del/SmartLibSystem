// Client-side script that calls Netlify functions
const DATA = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 }
];

const output = document.getElementById("output");

async function saveData() {
  output.textContent = "Saving...";
  try {
    const res = await fetch("/.netlify/functions/saveData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: DATA, commitMessage: "Save DATA from site" })
    });
    const json = await res.json();
    output.textContent = JSON.stringify(json, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}

async function loadData() {
  output.textContent = "Loading...";
  try {
    const res = await fetch("/.netlify/functions/loadData");
    const json = await res.json();
    output.textContent = JSON.stringify(json, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}

document.getElementById("saveBtn").addEventListener("click", saveData);
document.getElementById("loadBtn").addEventListener("click", loadData);
