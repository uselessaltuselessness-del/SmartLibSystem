// Node 14+ environment
const fetch = require("node-fetch");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // owner/repo
  const path = "data.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const payload = JSON.parse(event.body);
    const DATA = payload.data;
    const commitMessage = payload.commitMessage || "Update data.json";

    const jsonString = JSON.stringify(DATA, null, 2);
    const contentBase64 = Buffer.from(jsonString, "utf8").toString("base64");

    // Check if file exists to get sha (required for update)
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
    });

    const body = {
      message: commitMessage,
      content: contentBase64
    };

    if (getRes.ok) {
      const existing = await getRes.json();
      body.sha = existing.sha;
    }

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await putRes.json();

    if (!putRes.ok) {
      return { statusCode: putRes.status, body: JSON.stringify(result) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, result }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
