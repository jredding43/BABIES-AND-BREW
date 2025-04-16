const pool = require("./db");

const seed = async () => {
  try {
    await pool.query(`
      -- Clean all data while preserving schema
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM drink_options;
      DELETE FROM options;
      DELETE FROM drink_flavors;
      DELETE FROM flavors;
      DELETE FROM milk_options;
      DELETE FROM drink_sizes;
      DELETE FROM sizes;
      DELETE FROM size_other;
      DELETE FROM drinks;
      DELETE FROM drink_types;
      DELETE FROM categories;
      DELETE FROM drink_styles;
      DELETE FROM styles;
      DELETE FROM drink_shots;
      DELETE FROM shots;
    `);

    console.log(" Seeding started...");

    // --- Categories ---
    const categories = [
      "Espresso",
      "Energy Drink",
      "Non-Coffee",
      "Tea",
      "Other" 
    ];

    const categoryIds = {};
    for (const name of categories) {
      const res = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
        [name]
      );

      if (res.rows.length > 0) {
        categoryIds[name] = res.rows[0].id;
      } else {
        const existing = await pool.query("SELECT id FROM categories WHERE name = $1", [name]);
        categoryIds[name] = existing.rows[0].id;
      }
    }

    // --- Drink Types ---
    const drinkTypes = {
      Espresso: ["Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha", "Breve", "Dirty Chai", "Drip Coffee", "Select A Drink"],
      "Energy Drink": ["Lotus", "Redbull Spritzer"],
      "Non-Coffee": ["Italian Soda", "Hot Chocolate", "Lemonade", "Smoothie"],
      Tea: ["Chai", "Oregon", "Jet Tea", "London Fog", "Matcha Latte"],
      Other: []
    };

    const drinkTypeIds = {};
    for (const [cat, types] of Object.entries(drinkTypes)) {
      for (const name of types) {
        const res = await pool.query(
          "INSERT INTO drink_types (name, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id",
          [name, categoryIds[cat]]
        );

        if (res.rows.length > 0) {
          drinkTypeIds[name] = res.rows[0].id;
        } else {
          const existing = await pool.query(
            "SELECT id FROM drink_types WHERE name = $1 AND category_id = $2",
            [name, categoryIds[cat]]
          );
          drinkTypeIds[name] = existing.rows[0].id;
        }
      }
    }

    // --- Sample Drinks ---
    const drinks = [
      { name: "Vanilla Latte", type: "Latte", price: 4.00 },
      { name: "Caramel Mocha", type: "Mocha", price: 4.50 },
      { name: "Peach Lotus", type: "Lotus", price: 5.00 },
    ];

    const drinkIds = {};
    for (const drink of drinks) {
      const res = await pool.query(
        "INSERT INTO drinks (drink_type_id, name, base_price) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id",
        [drinkTypeIds[drink.type], drink.name, drink.price]
      );

      if (res.rows.length > 0) {
        drinkIds[drink.name] = res.rows[0].id;
      } else {
        const existing = await pool.query("SELECT id FROM drinks WHERE name = $1", [drink.name]);
        drinkIds[drink.name] = existing.rows[0].id;
      }
    }

    // --- Sizes ---
    const sizes = ["12oz", "16oz", "20oz", "24oz", "32oz"];
    const sizeIds = {};
    for (const size of sizes) {
      const res = await pool.query(
        "INSERT INTO sizes (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
        [size]
      );

      if (res.rows.length > 0) {
        sizeIds[size] = res.rows[0].id;
      } else {
        const existing = await pool.query("SELECT id FROM sizes WHERE name = $1", [size]);
        sizeIds[size] = existing.rows[0].id;
      }
    }

    // --- Sizes Other ---
    const size_other = ["12oz", "16oz", "20oz", "24oz", "32oz"];
    const size_otherIds = {};
    for (const size of size_other) {
      const res = await pool.query(
        "INSERT INTO size_other (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
        [size]
      );

      if (res.rows.length > 0) {
        size_otherIds[size] = res.rows[0].id;
      } else {
        const existing = await pool.query("SELECT id FROM size_other WHERE name = $1", [size]);
        size_otherIds[size] = existing.rows[0].id;
      }
    }

    // --- Drink Sizes ---
    await pool.query(
      "INSERT INTO drink_sizes (drink_id, size_id, price_adjustment) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
      [drinkIds["Vanilla Latte"], sizeIds["12oz D"], 0.00]
    );
    await pool.query(
      "INSERT INTO drink_sizes (drink_id, size_id, price_adjustment) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
      [drinkIds["Vanilla Latte"], sizeIds["16oz D"], 0.50]
    );

    // --- Milk Options ---
    const milks = ["Whole", "2% Milk", "Almond Milk", "Oat Milk", "Soy Milk"];
    for (const milk of milks) {
      await pool.query(
        "INSERT INTO milk_options (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [milk]
      );
    }

    // --- Styles ---
    const styles = ["Hot", "Iced", "Blended"];
    for (const style of styles) {
      await pool.query(
        "INSERT INTO styles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [style]
      );
    }

    // --- Shots ---
    const shots = [
      "Regular",
      "Decaf Shot",
      "Half Caff Shot",
      "Blonde Shot",
      "Extra Bold Shot"
    ];
    for (const shot of shots) {
      await pool.query(
        "INSERT INTO shots (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [shot]
      );
    }

    // --- Flavors ---
    const flavors = [
      "Almond", "Amaretto", "Apple", "Banana", "Blackberry", "Blueberry", "Brown Sugar",
      "Butter Pecan", "Butterscotch", "Cake Batter", "Caramel", "Chai", "Cherry",
      "Chocolate", "Cinnamon", "Coconut", "Cookie Dough", "Cotton Candy", "Crème Brûlée",
      "Eggnog", "French Vanilla", "Gingerbread", "Grape", "Green Apple", "Hazelnut",
      "Honey", "Irish Cream", "Kiwi", "Lavender", "Lemon", "Lime", "Macadamia Nut",
      "Mango", "Maple", "Marshmallow", "Mint", "Mocha", "Orange", "Papaya", "Passion Fruit",
      "Peach", "Peanut Butter", "Pear", "Pineapple", "Pink Champagne", "Pistachio",
      "Plum", "Pomegranate", "Pumpkin Spice", "Raspberry", "Red Velvet", "Root Beer",
      "Salted Caramel", "Strawberry", "Tangerine", "Toasted Marshmallow", "Toffee Nut",
      "Vanilla", "Watermelon"
    ];
    for (const flavor of flavors) {
      await pool.query(
        "INSERT INTO flavors (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [flavor]
      );
    }

    // --- Options ---
    const options = [
      "Whipped Cream", "Drizzle", "Shot", "2 Shots", "3 shots", "White Chocolate Powder", "Heavy Cream", "Lotus Cream", "Soft Top", "Glitter",
      "Topping", "Popping Pearl", "Orange Juice (2oz)", "Extra Cup", "Extra Tea Bag"
    ];
    for (const option of options) {
      await pool.query(
        "INSERT INTO options (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [option]
      );
    }

    console.log(" Seeding complete.");
    process.exit();
  } catch (err) {
    console.error(" Seeding failed:", err);
    process.exit(1);
  }
};

seed();
