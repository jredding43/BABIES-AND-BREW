import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Define menu item type
type MenuItem = {
  name: string;
  description: string;
  price: string;
};

// Define menu data structure
const menuData: Record<string, MenuItem[]> = {
  "Coffees": [
    {
        name: "Caramel Oat Milk Latte",
        description: "Rich espresso with creamy oat milk and caramel.",
        price: "$5.25",
      },
      {
        name: "Vanilla Cold Brew",
        description: "Smooth cold brew with vanilla syrup and cream.",
        price: "$4.95",
      },
      {
        name: "Mocha Bliss",
        description: "Espresso, steamed milk, and velvety chocolate syrup.",
        price: "$5.45",
      },
      {
        name: "Iced Americano",
        description: "Bold espresso poured over ice with a splash of water.",
        price: "$4.25",
      },
      {
        name: "Hazelnut Latte",
        description: "A nutty twist on a creamy espresso classic.",
        price: "$5.15",
      },
      {
        name: "Classic Cappuccino",
        description: "Equal parts espresso, steamed milk, and foam.",
        price: "$4.95",
      },
      {
        name: "Brown Sugar Shaken Espresso",
        description: "Espresso shaken with brown sugar and cinnamon over ice.",
        price: "$5.50",
      },
      {
        name: "White Chocolate Mocha",
        description: "White chocolate syrup blended with espresso and milk.",
        price: "$5.65",
      },
      {
        name: "Pumpkin Spice Latte",
        description: "Seasonal favorite with pumpkin, nutmeg, and cinnamon.",
        price: "$5.75",
      },
      {
        name: "Espresso Macchiato",
        description: "Double shot of espresso topped with a dollop of foam.",
        price: "$3.95",
      },
      {
        name: "Iced Coffee",
        description: "Freshly brewed and chilled over ice. Simple and refreshing.",
        price: "$3.75",
      },
      {
        name: "Flat White",
        description: "Smooth micro-foamed milk over two shots of espresso.",
        price: "$4.85",
      },
      {
        name: "Toffee Nut Latte",
        description: "Sweet and salty toffee paired with steamed milk and espresso.",
        price: "$5.45",
      },
      {
        name: "Coconut Mocha",
        description: "Espresso blended with coconut milk and chocolate syrup.",
        price: "$5.60",
      },
      {
        name: "Affogato",
        description: "Espresso poured over a scoop of vanilla ice cream.",
        price: "$4.95",
      },
  ],
  "Coffee Flavors": [
  { name: "Vanilla Bean", description: "Smooth and classic vanilla flavor.", price: "" },
  { name: "Caramel Swirl", description: "Rich and buttery caramel syrup.", price: "" },
  { name: "Hazelnut", description: "Warm, nutty flavor that's great in lattes.", price: "" },
  { name: "Toffee Nut", description: "Sweet and nutty with a toffee twist.", price: "" },
  { name: "White Chocolate", description: "Creamy and sweet — perfect in mochas.", price: "" },
  { name: "Peppermint", description: "Cool and refreshing for mochas and brews.", price: "" },
  { name: "Pumpkin Spice", description: "Fall favorite with cinnamon, nutmeg, and pumpkin.", price: "" },
  { name: "Brown Sugar Cinnamon", description: "Cozy brown sugar mixed with warming spice.", price: "" },
  { name: "Almond", description: "Nutty and smooth — works great with espresso.", price: "" },
  { name: "Maple", description: "Warm maple syrup flavor, sweet and classic.", price: "" },
  { name: "Salted Caramel", description: "Sweet caramel with a hint of sea salt.", price: "" },
  { name: "Irish Cream", description: "Smooth and creamy — a coffeehouse favorite.", price: "" },
  { name: "Butter Pecan", description: "Sweet and roasted, perfect for warm lattes.", price: "" },
  { name: "Coconut", description: "Light and tropical — great with chocolate or vanilla.", price: "" },
  { name: "Mocha", description: "Chocolate + espresso — timeless blend.", price: "" }
],
  "Red Bull Creations": [
    {
      name: "Electric Raspberry Red Bull",
      description: "Red Bull with raspberry syrup and lemonade over ice.",
      price: "$5.25",
    },
    {
      name: "Tropical Sunrise Red Bull",
      description: "Red Bull mixed with mango and passionfruit flavors.",
      price: "$5.25",
    },
    {
      name: "Cherry Limeade Red Bull",
      description: "Classic cherry and lime flavors blended with Red Bull.",
      price: "$5.25",
    },
    {
      name: "Peach Paradise Red Bull",
      description: "Peach syrup, splash of coconut, and Red Bull.",
      price: "$5.25",
    },
    {
      name: "Watermelon Splash Red Bull",
      description: "Juicy watermelon with a hint of strawberry.",
      price: "$5.25",
    },
  ],

  "Lotus Energy Fusions": [
    {
      name: "Blue Lotus Bliss",
      description: "Blue raspberry Lotus energy with lemonade and ice.",
      price: "$5.50",
    },
    {
      name: "Pink Lotus Punch",
      description: "Pink Lotus with strawberry, peach, and a citrus twist.",
      price: "$5.50",
    },
    {
      name: "Mango Tango Lotus",
      description: "Mango Lotus mixed with passionfruit and lime.",
      price: "$5.50",
    },
    {
      name: "Lavender Lemon Lotus",
      description: "Floral lavender and bright lemon with white Lotus.",
      price: "$5.50",
    },
    {
      name: "Coconut Berry Lotus",
      description: "Tropical coconut and blueberry blended with Lotus.",
      price: "$5.50",
    },
  ],
  "Drink Flavors": [
  { name: "Strawberry", description: "Sweet and fruity, perfect for iced drinks.", price: "" },
  { name: "Blueberry", description: "A burst of berry flavor, light and fresh.", price: "" },
  { name: "Raspberry", description: "Tart and juicy, great in teas and Red Bull.", price: "" },
  { name: "Peach", description: "Smooth and mellow, summer classic.", price: "" },
  { name: "Mango", description: "Tropical and juicy — a customer favorite.", price: "" },
  { name: "Passionfruit", description: "Tangy and exotic flavor punch.", price: "" },
  { name: "Pineapple", description: "Bright and tropical, ideal for refreshers.", price: "" },
  { name: "Watermelon", description: "Light, crisp, and hydrating.", price: "" },
  { name: "Green Apple", description: "Tart and playful — great for kids’ drinks.", price: "" },
  { name: "Cherry", description: "Classic and bold, good in lemonades.", price: "" },
  { name: "Lavender", description: "Lightly floral, calming and unique.", price: "" },
  { name: "Cotton Candy", description: "Whimsical and sweet — kids love it!", price: "" },
  { name: "Orange Cream", description: "Dreamy creamsicle vibes.", price: "" },
  { name: "Tropical Punch", description: "Blend of fruits — juicy and vibrant.", price: "" },
  { name: "Dragon Fruit", description: "Mildly sweet and exotic.", price: "" }
],
  "Kids' Drinks": [
    {
      name: "Chocolate Steamer",
      description: "Warm milk with chocolate syrup — no caffeine.",
      price: "$3.00",
    },
  ]
};

const Menu = () => {
  const categories = Object.keys(menuData);
  const [index, setIndex] = useState(0);
  const currentCategory = categories[index];
  const items = menuData[currentCategory]; 

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-orange-50 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center relative">
        <h2
          className="text-6xl font-bold text-orange-400 mb-12"
          style={{ fontFamily: '"Rock 3D", cursive' }}
        >
          Our Menu
        </h2>

        <div className="bg-white rounded-lg shadow p-4 relative">
          {/* Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-[-2rem] top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600"
          >
            <FaChevronLeft size={36} />
          </button>

          {/* Scrollable menu content */}
          <div className="text-left max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-300">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              {currentCategory}
            </h3>

            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={idx} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <p className="text-md font-bold text-orange-600">{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-[-2rem] top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600"
          >
            <FaChevronRight size={36} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
