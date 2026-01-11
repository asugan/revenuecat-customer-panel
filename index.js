const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3002;
const apiBaseUrl = process.env.RC_API_BASE_URL || "https://api.revenuecat.com/v2";
const secretApiKey = process.env.RC_SECRET_API_KEY;
const projectId = process.env.RC_PROJECT_ID;

if (!secretApiKey) {
  console.error("RC_SECRET_API_KEY is required in environment variables.");
  process.exit(1);
}

if (!projectId) {
  console.error("RC_PROJECT_ID is required in environment variables.");
  process.exit(1);
}

app.use(express.json());
app.use(express.static("public"));

const buildHeaders = () => ({
  Authorization: `Bearer ${secretApiKey}`,
  Accept: "application/json",
});

const parseResponseBody = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
};

const rcRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...options.headers,
    },
  });

  const body = await parseResponseBody(response);
  return { status: response.status, body };
};

app.get("/customers", async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${apiBaseUrl}/projects/${encodeURIComponent(projectId)}/customers${queryString ? `?${queryString}` : ""}`;
    const { status, body } = await rcRequest(url);

    res.status(status).json(body);
  } catch (error) {
    res.status(502).json({
      error: "RevenueCat request failed",
      details: error.message,
    });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const url = `${apiBaseUrl}/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(customerId)}`;
    const { status, body } = await rcRequest(url, { method: "DELETE" });

    res.status(status).json(body);
  } catch (error) {
    res.status(502).json({
      error: "RevenueCat request failed",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
