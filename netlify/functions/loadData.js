const fetch = require("node-fetch");

exports.handler = async function() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const path = "data.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
    });

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: "File not found or access denied" }) };
    }

    const file = await res.json();
    const decoded = Buffer.from(file.content, "base64").toString("utf8");
    const data = JSON.parse(decoded);

    return { statusCode: 200, body: JSON.stringify({ data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
