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
      DELETE FROM drink_type_sizes;
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
      Tea: ["Tea", "Chai", "London Fog", "Matcha Latte"],
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


    // --- Milk Options ---
    const milks = [
      { name: "Whole", price_adjustment: 0.00 },
      { name: "2% Milk", price_adjustment: 0.00 },
      { name: "Almond Milk + $0.75", price_adjustment: 0.75 },
      { name: "Oat Milk + $0.75", price_adjustment: 0.75 },
      { name: "Soy Milk + $0.75", price_adjustment: 0.75 },
      { name: "Heavy Cream + $1.00", price_adjustment: 1.00 },
      { name: "Lotus Cream + $0.50", price_adjustment: 0.50 },
      { name: "None", price_adjustment: 0.00 }
    ];

    for (const milk of milks) {
      await pool.query(
        `INSERT INTO milk_options (name, price_adjustment)
        VALUES ($1, $2)
        ON CONFLICT (name) DO UPDATE SET price_adjustment = EXCLUDED.price_adjustment`,
        [milk.name, milk.price_adjustment]
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
      "Add No Flavor", "Almond", "Amaretto", "Apple", "Banana", "Blackberry", "Blueberry", "Brown Sugar",
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
        "INSERT INTO flavors (name, price_adjustment) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET price_adjustment = EXCLUDED.price_adjustment",
        [flavor, 0.5]
      );
    }
    

    // --- Options ---
    const options = [
      "Whipped Cream", "Drizzle", "Shot", "2 Shots", "3 shots", "White Chocolate Powder", "Soft Top", "Glitter",
      "Topping", "Popping Pearl", "Orange Juice (2oz)", "Extra Cup", "Extra Tea Bag"
    ];
    for (const option of options) {
      await pool.query(
        "INSERT INTO options (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [option]
      );
    }

    // --- Drink Type + Size Prices ---
  const drink_type_sizes = [
    { drink: "Americano", prices: { "12oz": 4.00, "16oz": 4.25, "20oz": 5.00, "24oz": 5.75, "32oz": 6.00 } },
    { drink: "Latte", prices: { "12oz": 5.00, "16oz": 5.25, "20oz": 6.00, "24oz": 6.75, "32oz": 7.00 } },
    { drink: "Mocha", prices: { "12oz": 5.25, "16oz": 5.50, "20oz": 6.25, "24oz": 7.00, "32oz": 7.25 } },
    { drink: "Signature Mocha", prices: { "12oz": 5.75, "16oz": 6.00, "20oz": 6.75, "24oz": 7.50, "32oz": 8.00 } },
    { drink: "Signature Latte", prices: { "12oz": 5.50, "16oz": 5.75, "20oz": 6.50, "24oz": 7.25, "32oz": 7.75 } },
    { drink: "Breve", prices: { "12oz": 5.75, "16oz": 6.00, "20oz": 6.75, "24oz": 7.50, "32oz": 7.75 } },
    { drink: "Dirty Chai", prices: { "12oz": 5.75, "16oz": 6.00, "20oz": 6.75, "24oz": 7.50, "32oz": 8.00 } },
    { drink: "Drip Coffee", prices: { "12oz": 2.75, "16oz": 3.00, "20oz": 3.25, "24oz": 3.5 } },
    { drink: "Chai", prices: { "12oz": 4.75, "16oz": 5.00, "20oz": 5.25, "24oz": 5.50, "32oz": 6.00 } },
    { drink: "Matcha Latte", prices: { "12oz": 4.50, "16oz": 4.75, "20oz": 5.00, "24oz": 5.25, "32oz": 5.75 } },
    { drink: "Hot Chocolate", prices: { "12oz": 4.00, "16oz": 4.25, "20oz": 4.50, "24oz": 4.75, "32oz": 5.25 } },
    { drink: "Lotus", prices: { "12oz": 5.25, "16oz": 5.50, "20oz": 5.75, "24oz": 6.00, "32oz": 6.75 } },
    { drink: "Redbull Spritzer", prices: { "12oz": 5.50, "16oz": 5.75, "20oz": 6.00, "24oz": 6.25, "32oz": 7.25 } },
    { drink: "Italian Soda", prices: { "12oz": 3.75, "16oz": 4.00, "20oz": 4.25, "24oz": 4.50, "32oz": 5.00 } },
    { drink: "Smoothie", prices: { "12oz": 5.25, "16oz": 5.50, "20oz": 5.75, "24oz": 6.00, "32oz": 6.50 } },
    { drink: "Lemonade", prices: { "12oz": 2.75, "16oz": 3.00, "20oz": 3.25, "24oz": 3.50, "32oz": 4.00 } },
    { drink: "London Fog", prices: { "12oz": 4.25, "16oz": 4.50, "20oz": 4.75, "24oz": 5.00, "32oz": 5.50 } },
    { drink: "Tea", prices: { "12oz": 2.75, "16oz": 3.00, "20oz": 3.25, "24oz": 3.50, "32oz": 4.00 } },
  ];

  const drinkIds = {};
  for (const entry of drink_type_sizes) {
    const drinkTypeId = drinkTypeIds[entry.drink];
  
    for (const [sizeName, price] of Object.entries(entry.prices)) {
      const sizeId = sizeIds[sizeName];
  
      await pool.query(
        "INSERT INTO drink_type_sizes (drink_type_id, size_id, price) VALUES ($1, $2, $3)",
        [drinkTypeId, sizeId, price]
      );
    }
  }
  



    console.log(" Seeding complete.");
    process.exit();
  } catch (err) {
    console.error(" Seeding failed:", err);
    process.exit(1);
  }
};


(async () => {
  await seed();
})();

