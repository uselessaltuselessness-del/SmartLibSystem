// netlify/functions/saveData.js
// Uses Node 18 global fetch and Buffer
exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // expected format: owner/repo
  if (!token || !repo) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing GITHUB_TOKEN or GITHUB_REPO env var" }) };
  }

  const path = "data.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const payload = JSON.parse(event.body || "{}");
    const DATA = payload.data ?? [];
    const commitMessage = payload.commitMessage || "Update data.json from Netlify Function";

    const jsonString = JSON.stringify(DATA, null, 2);
    const contentBase64 = Buffer.from(jsonString, "utf8").toString("base64");

    // Check if file exists to get sha for update
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
    });

    const body = { message: commitMessage, content: contentBase64 };

    if (getRes.ok) {
      const existing = await getRes.json();
      body.sha = existing.sha;
      console.log("Existing file sha:", existing.sha);
    } else {
      // log response body for diagnostics
      const text = await getRes.text();
      console.log("GET file status:", getRes.status, "body:", text);
    }

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const resultText = await putRes.text();
    let result;
    try { result = JSON.parse(resultText); } catch (e) { result = resultText; }

    if (!putRes.ok) {
      console.error("PUT failed:", putRes.status, result);
      return { statusCode: putRes.status, body: JSON.stringify({ error: result }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, result }) };
  } catch (err) {
    console.error("saveData error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
