import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Size {
  id: number;
  name: string;
}

interface DrinkType {
  id: number;
  name: string;
  category_id: number;
}

interface MilkOption {
  id: number;
  name: string;
  price_adjustment: number;
}

interface Flavor {
  id: number;
  name: string;
  price_adjustment: number;
}

interface Option {
  id: number;
  name: string;
  price_adjustment: number;
}

interface DrinkStyle {
  id: number;
  name: string;
}

interface Shots {
    id: number;
    name: string;
}

const OrderPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [drinkTypes, setDrinkTypes] = useState<DrinkType[]>([]);
  const [milkOptions, setMilkOptions] = useState<MilkOption[]>([]);
  const [drinkStyles, setDrinkStyles] = useState<DrinkStyle[]>([]);
  const [drinkShots, setDrinkShots] = useState<Shots []>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedDrinkTypeId, setSelectedDrinkTypeId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMilk, setSelectedMilk] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedShots, setSelectedShots] = useState<number | null>(null);

  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isCheckoutStarted, setIsCheckoutStarted] = useState(false);


  const drinkStyleOptions: Record<string, string[]> = {
    // Espresso 
    "Americano": ["Hot", "Iced"],
    "Latte": ["Hot", "Iced", "Blended"],
    "Signature Latte": ["Hot", "Iced", "Blended"],
    "Mocha": ["Hot", "Iced", "Blended"],
    "Signature Mocha": ["Hot", "Iced", "Blended"],
    "Breve": ["Hot", "Iced", "Blended"],
    "Dirty Chai": ["Hot", "Iced"],
    "Drip Coffee": ["Hot"],
    "Select A Drink": [],
  
    // Energy Drinks
    "Lotus": ["Iced", "Blended"],
    "Redbull Spritzer": ["Iced", "Blended"],
  
    // Non-Coffee
    "Italian Soda": ["Iced", "Blended"],
    "Hot Chocolate": ["Hot"],
    "Lemonade": ["Iced", "Blended"],
    "Smoothie": ["Blended"],
  
    // Tea
    "Chai": ["Hot", "Iced"],
    "Oregon": ["Hot", "Iced"],
    "Jet Tea": ["Iced", "Blended"],
    "London Fog": ["Hot"],
    "Matcha Latte": ["Hot", "Iced", "Blended"],
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, sizeRes, typesRes, milkRes, flavorRes, optionRes, stylesRes, shotRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/sizes"),
        fetch("http://localhost:5000/api/drink_types"),
        fetch("http://localhost:5000/api/milk_options"),
        fetch("http://localhost:5000/api/flavors"),
        fetch("http://localhost:5000/api/options"),
        fetch("http://localhost:5000/api/styles"),
        fetch("http://localhost:5000/api/shots"),
      ]);

      setCategories(await catRes.json());
      setSizes(await sizeRes.json());
      setDrinkTypes(await typesRes.json());
      setMilkOptions(await milkRes.json());
      setFlavors(await flavorRes.json());
      setOptions(await optionRes.json());
      setDrinkStyles(await stylesRes.json());
      setDrinkShots(await shotRes.json())
    };

    fetchData();
  }, []);

  const filteredTypes = selectedCategoryId
    ? drinkTypes.filter((type) => type.category_id === selectedCategoryId)
    : [];

    const handleAddOrder = () => {
        const category = categories.find((c) => c.id === selectedCategoryId);
        const drinkType = drinkTypes.find((dt) => dt.id === selectedDrinkTypeId);
        const milk = milkOptions.find((m) => m.name === selectedMilk);
        const style = drinkStyles.find((s) => s.name === selectedStyle);
        const shots = drinkShots.find((s) => s.id === selectedShots);
        const selectedFlavorObjects = flavors.filter((f) => selectedFlavors.includes(f.id));
        const selectedOptionObjects = options.filter((o) => selectedOptions.includes(o.id));
      
        const newOrderItem = {
          category,
          drinkType,
          size: selectedSize,
          milk,
          style,
          shots,
          flavors: selectedFlavorObjects,
          options: selectedOptionObjects,
        };
      
        setOrderItems((prevItems) => [...prevItems, newOrderItem]);
      
        // Reset form
        setSelectedCategoryId(null);
        setSelectedDrinkTypeId(null);
        setSelectedSize(null);
        setSelectedMilk(null);
        setSelectedFlavors([]);
        setSelectedOptions([]);
        setSelectedShots(null);
        setSelectedStyle(null);
      };

      const selectedDrink = drinkTypes.find((dt) => dt.id === selectedDrinkTypeId);
      const espressoDrinks = [
        "Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha",
        "Breve", "Dirty Chai", "Drip Coffee"
      ];
      const requiresShots = selectedDrink ? espressoDrinks.includes(selectedDrink.name) : false;
      
      const isOrderReady =
        selectedCategoryId !== null &&
        selectedDrinkTypeId !== null &&
        selectedSize !== null &&
        selectedStyle !== null &&
        selectedMilk !== null &&
        (!requiresShots || selectedShots !== null); 
      
   

      

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Build Your Drink</h1>

      <div className="border rounded-lg shadow p-4 space-y-6 bg-white">
        {/* 1. Category */}
        <div>
          <h2 className="font-semibold mb-2">1. Choose Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded border ${
                  selectedCategoryId === cat.id ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setSelectedDrinkTypeId(null);
                  setSelectedStyle(null);
                  setSelectedSize(null);
                  setSelectedMilk(null);
                  setSelectedFlavors([]);
                  setSelectedOptions([]);
                  setSelectedShots(null);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
         
        {/* 2. Drink Type */}
        {selectedCategoryId && (
        <div>
            <h2 className="font-semibold mb-2">2. Pick a Drink Type</h2>
            <div className="flex flex-wrap gap-2">
            {filteredTypes.map((type) => (
                <button
                key={type.id}
                className={`px-4 py-2 rounded border ${
                    selectedDrinkTypeId === type.id ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => {
                    setSelectedDrinkTypeId(type.id);
                    setSelectedSize(null);
                    setSelectedStyle(null);
                    setSelectedShots(null);
                    setSelectedMilk(null);
                }}
                >
                {type.name}
                </button>
            ))}
            </div>
        </div>
        )}

        {/* 3. Size */}
        {selectedDrinkTypeId && (
        <div>
            <h2 className="font-semibold">3. Select Size</h2>

            {(() => {
            const selectedDrink = drinkTypes.find((dt) => dt.id === selectedDrinkTypeId);
            const espressoDrinks = [
                "Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha",
                "Breve", "Dirty Chai", "Drip Coffee"
            ];
            return selectedDrink && espressoDrinks.includes(selectedDrink.name) ? (
                <h3 className="italic mb-2">12oz/16oz Double - 20oz Triple - 24oz/32oz Quad</h3>
            ) : null;
            })()}

            <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
                <button
                key={size.id}
                className={`px-4 py-2 rounded border ${
                    selectedSize === size.name ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSize(size.name)}
                >
                {size.name}
                </button>
            ))}
            </div>
        </div>
        )}


        {/* 4. Style */}
        {selectedDrinkTypeId && (() => {
        const selectedDrink = drinkTypes.find((dt) => dt.id === selectedDrinkTypeId);
        const validStyles = selectedDrink ? drinkStyleOptions[selectedDrink.name] || [] : [];

        if (validStyles.length === 0) return null;

        return (
            <div>
            <h2 className="font-semibold mb-2">4. Select Style</h2>
            <div className="flex flex-wrap gap-2">
                {drinkStyles
                .filter((style) => validStyles.includes(style.name))
                .map((style) => (
                    <button
                    key={style.id}
                    className={`px-4 py-2 rounded border ${
                        selectedStyle === style.name ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedStyle(style.name)}
                    >
                    {style.name}
                    </button>
                ))}
            </div>
            </div>
        );
        })()}


        {/* 5. Shot */}
        {selectedStyle && (() => {
        const espressoDrinks = [
            "Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha",
            "Breve", "Dirty Chai", "Drip Coffee"
        ];
        const selectedDrink = drinkTypes.find((dt) => dt.id === selectedDrinkTypeId);
        const showShots = selectedDrink ? espressoDrinks.includes(selectedDrink.name) : false;

        if (!showShots) return null;

        return (
            <div>
            <h2 className="font-semibold mb-2">5. Select a Shot</h2>
            <div className="flex flex-wrap gap-2">
                {drinkShots.map((shot) => (
                <button
                    key={shot.id}
                    className={`px-4 py-2 rounded border ${
                    selectedShots === shot.id ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedShots(shot.id)}
                >
                    {shot.name}
                </button>
                ))}
            </div>
            </div>
        );
        })()}


        {/* 6. Milk */}
        {selectedStyle && (!requiresShots || selectedShots !== null) && (
        <div>
            <h2 className="font-semibold mb-2">6. Choose Milk</h2>
            <div className="flex flex-wrap gap-2">
            {milkOptions.map((milk) => (
                <button
                key={milk.id}
                className={`px-4 py-2 rounded border ${
                    selectedMilk === milk.name ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedMilk(milk.name)}
                >
                {milk.name}
                </button>
            ))}
            </div>
        </div>
        )}

        {/* 7. Flavors */}
        {selectedMilk && (
        <div>
            <h2 className="font-semibold mb-2">7. Add Flavors</h2>
            <div className="max-h-48 overflow-y-auto border rounded p-2">
            {[...flavors]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((flavor) => (
                <label key={flavor.id} className="flex items-center gap-2 py-1">
                    <input
                    type="checkbox"
                    checked={selectedFlavors.includes(flavor.id)}
                    onChange={() =>
                        setSelectedFlavors((prev) =>
                        prev.includes(flavor.id)
                            ? prev.filter((id) => id !== flavor.id)
                            : [...prev, flavor.id]
                        )
                    }
                    />
                    <span>{flavor.name}</span>
                </label>
                ))}
            </div>
        </div>
        )}

        {/* 8. Extras */}
        {selectedFlavors.length > 0 && (
        <div>
            <h2 className="font-semibold mb-2">8. Add Extras</h2>
            <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                <button
                key={option.id}
                className={`px-4 py-2 rounded border ${
                    selectedOptions.includes(option.id) ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() =>
                    setSelectedOptions((prev) =>
                    prev.includes(option.id)
                        ? prev.filter((id) => id !== option.id)
                        : [...prev, option.id]
                    )
                }
                >
                {option.name}
                </button>
            ))}
            </div>
        </div>
        )}

        {orderItems.length > 0 && (
        <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Current Order</h2>
            <ul className="space-y-2">
            {orderItems.map((item, index) => {
                const espressoDrinks = [
                "Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha",
                "Breve", "Dirty Chai", "Drip Coffee"
                ];
                const isEspresso = item.drinkType && espressoDrinks.includes(item.drinkType.name);

                return (
                <li key={index} className="p-3 bg-gray-100 rounded">
                    <div>
                    <strong>{item.size}</strong> {item.drinkType?.name} ({item.category?.name})
                    </div>
                    <div>Style: {item.style?.name}</div>
                    <div>Milk: {item.milk?.name}</div>

                    {isEspresso && (
                    <div>Shot: {item.shots?.name}</div>
                    )}

                    {item.flavors.length > 0 && (
                    <div>Flavors: {item.flavors.map((f: any) => f.name).join(", ")}</div>
                    )}
                    {item.options.length > 0 && (
                    <div>Extras: {item.options.map((o: any) => o.name).join(", ")}</div>
                    )}
                </li>
                );
            })}
            </ul>
        </div>
        )}

        <button
        onClick={handleAddOrder}
        disabled={!isOrderReady}
        className={`mt-4 px-4 py-2 rounded transition ${
            isOrderReady
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        >
        Add to Order
        </button>

         {/* Checkout Button */}
        <div className="mt-4 text-center">
        <button
            onClick={() => {
            setIsCheckoutStarted(true);
            console.log("Proceeding to checkout", orderItems);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            Proceed to Checkout
        </button>
        </div>

      </div>
    </div>
  );
};

export default OrderPage;
