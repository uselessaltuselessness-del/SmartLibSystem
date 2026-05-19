const token = "YOUR_PERSONAL_ACCESS_TOKEN"; // ⚠️ Don't expose in production
const repo = "your-username/data-store-demo";
const path = "data.json";

const DATA = [
  { name: "Alice", score: 10 },
  { name: "Bob", score: 20 }
];

// Save data to GitHub
document.getElementById("saveBtn").onclick = () => {
  const jsonString = JSON.stringify(DATA, null, 2);
  const encoded = btoa(jsonString);

  fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify({
      message: "Save DATA array",
      content: encoded
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("output").textContent = "Saved: " + JSON.stringify(data, null, 2);
  })
  .catch(err => console.error(err));
};

// Load data from GitHub
document.getElementById("loadBtn").onclick = () => {
  fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(file => {
    const decoded = atob(file.content);
    const loadedData = JSON.parse(decoded);
    document.getElementById("output").textContent = "Loaded: " + JSON.stringify(loadedData, null, 2);
  })
  .catch(err => console.error(err));
};
