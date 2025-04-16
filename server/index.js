const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// --- CORS Configuration ---
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Request Logger ---
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// --- Root Health Check ---
app.get("/", (req, res) => {
  res.send("Backend is live and CORS is enabled!");
});

// --- POST: Submit drink ---
app.post("/submit-drink", async (req, res) => {
  const { answers } = req.body;
  try {
    await pool.query("INSERT INTO survey_responses (answers) VALUES ($1)", [
      JSON.stringify(answers)
    ]);
    res.status(200).send("Drink submitted successfully");
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Error submitting drink!");
  }
});

// --- Generic GET Helper ---
const registerTableEndpoint = (table) => {
  app.get(`/api/${table}`, async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${table}`);
      res.json(result.rows);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err.message);
      res.status(500).send(`Failed to fetch ${table}`);
    }
  });
};

// --- Register all GET endpoints ---
[
  "categories",
  "drink_types",
  "drinks",
  "sizes",
  "size_other",
  "styles",
  "options",
  "milk_options",
  "flavors",
  "coffee_flavorings",
  "energy_flavorings",
  "orders",
  "order_items",
  "shots"
].forEach(registerTableEndpoint);

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
