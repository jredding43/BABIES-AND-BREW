const pool = require("./db");

const seed = async () => {
  try {
    await pool.query(`
      TRUNCATE 
        prebuilt_drinks,
        order_items,
        orders,
        drink_options,
        options,
        drink_flavors,
        flavors,
        milk_options,
        drink_sizes,
        sizes,
        size_other,
        drinks,
        drink_types,
        categories,
        drink_styles,
        styles,
        drink_shots,
        shots,
        drink_type_sizes
      RESTART IDENTITY CASCADE;
    `);
    
    

    console.log(" Seeding started...");

    async function getIdByName(table, name) {
      const res = await pool.query(`SELECT id FROM ${table} WHERE name = $1 LIMIT 1`, [name]);
      if (res.rows.length === 0) throw new Error(`No entry found in ${table} with name: ${name}`);
      return res.rows[0].id;
    }
    

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
      Espresso: ["Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha", "Breve", "Dirty Chai", "Drip Coffee"],
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
      { name: "Whipped Cream", price_adjustment: 0.50 },
      { name: "Shot", price_adjustment: 0.50 },
      { name: "2 Shots", price_adjustment: 1.00 },
      { name: "3 Shots", price_adjustment: 1.50 },
      { name: "White Chocolate Powder", price_adjustment: 0.25 },
      { name: "Soft Top", price_adjustment: 1.00 },
      { name: "Glitter", price_adjustment: 0.50 },
      { name: "Toppings", price_adjustment: 0.75 },
      { name: "Popping Pearls", price_adjustment: 1.00 },
      { name: "Orange Juice (2oz)", price_adjustment: 0.50 },
      { name: "Extra Cup", price_adjustment: 0.25 },
      { name: "Extra Tea Bag", price_adjustment: 0.50 },
      { name: "No Ice", price_adjustment: 0.75 },
      { name: "Light Ice", price_adjustment: 0.50 },
    ];

    for (const option of options) {
      await pool.query(
        "INSERT INTO options (name, price_adjustment) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING",
        [option.name, option.price_adjustment]
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
  
  const prebuiltDrinks = [
    {
      name: "White Chocolate Mocha",
      category: "Espresso",
      drinkType: "Mocha",
      size: "16oz",
      style: "Hot",
      milkOption: "2% Milk",
      shot: "Regular",
      flavors: ["Almond", "Vanilla"],
      options: ["Whipped Cream"],
      price: 5.50,
    },
    {
      name: "White Angel",
      category: "Espresso",
      drinkType: "Latte",
      size: "16oz",
      style: "Iced",
      milkOption: "2% Milk",
      shot: "Regular",
      flavors: ["Hazelnut", "Vanilla", "Cinnamon"],
      options: ["White Chocolate Powder"],
      price: 5.50,
    },
    {
      name: "Tree Green",
      category: "Energy Drink",
      drinkType: "Redbull Spritzer",
      size: "16oz",
      style: "Iced",
      milkOption: "Heavy Cream + $1.00",
      shot: "",
      flavors: ["Blueberry", "Vanilla", "Watermelon"],
      options: ["Whipped Cream"],
      price: 5.50,
    },
  ];
  
  for (const drink of prebuiltDrinks) {
    const categoryId = await getIdByName("categories", drink.category);
    const drink_type_id = await getIdByName("drink_types", drink.drinkType);
    const milk_option_id = await getIdByName("milk_options", drink.milkOption);
    let shot_id = null;
    if (drink.shot && drink.shot.trim() !== "") {
      shot_id = await getIdByName("shots", drink.shot);
    }

  
    const flavor_ids = await Promise.all(
      drink.flavors.map((name) => getIdByName("flavors", name))
    );
  
    const option_ids = await Promise.all(
      drink.options.map((name) => getIdByName("options", name))
    );
  
    await pool.query(
      `INSERT INTO prebuilt_drinks 
       (name, category_id, drink_type_id, size, style, milk_option_id, shot_id, flavor_ids, option_ids, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (name) DO NOTHING`,
      [
        drink.name,
        categoryId,
        drink_type_id,
        drink.size,
        drink.style,
        milk_option_id,
        shot_id,
        flavor_ids,
        option_ids,
        drink.price,
      ]
    );
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

