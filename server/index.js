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

// --- POST: Submit drink survey ---
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

// --- Register static table endpoints ---
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
  "shots",
  "drink_type_sizes"
].forEach(registerTableEndpoint);

// --- Custom GET: Prebuilt drinks ---
app.get("/api/prebuilt_drinks", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pd.id,
        pd.name,
        pd.size,
        pd.style,
        pd.price,
        dt.name AS drink_type_name,
        c.name AS category_name,
        mo.name AS milk_name,
        s.name AS shot_name,
        pd.flavor_ids,
        pd.option_ids
      FROM prebuilt_drinks pd
      JOIN drink_types dt ON pd.drink_type_id = dt.id
      JOIN categories c ON pd.category_id = c.id
      LEFT JOIN milk_options mo ON pd.milk_option_id = mo.id
      LEFT JOIN shots s ON pd.shot_id = s.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch prebuilt drinks", err);
    res.status(500).send("Error fetching prebuilt drinks");
  }
});


// --- GET: Price from drink_type_sizes ---
app.get("/api/pricing", async (req, res) => {
  const { drink_type_id, size } = req.query;

  if (!drink_type_id || !size) {
    return res.status(400).json({ error: "Missing drink_type_id or size" });
  }

  try {
    const result = await pool.query(
      `
      SELECT dts.price
      FROM drink_type_sizes dts
      JOIN sizes s ON dts.size_id = s.id
      WHERE dts.drink_type_id = $1 AND s.name = $2
      LIMIT 1
      `,
      [drink_type_id, size]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Price not found" });
    }

    res.json({ price: parseFloat(result.rows[0].price) });
  } catch (err) {
    console.error("Pricing fetch error:", err);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
