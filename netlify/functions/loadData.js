// netlify/functions/loadData.js
exports.handler = async function() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing GITHUB_TOKEN or GITHUB_REPO env var" }) };
  }

  const path = "data.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
    });

    const text = await res.text();
    console.log("LOAD status:", res.status, "body:", text);

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: text }) };
    }

    const file = JSON.parse(text);
    const decoded = Buffer.from(file.content, "base64").toString("utf8");
    const data = JSON.parse(decoded);

    return { statusCode: 200, body: JSON.stringify({ data }) };
  } catch (err) {
    console.error("loadData error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
