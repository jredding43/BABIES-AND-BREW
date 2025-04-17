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
  const [, setIsCheckoutStarted] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const [notes, setNotes] = useState<string>("");
  const [orderName, setOrderName] = useState<string>("");
  const [prebuiltDrinks, setPrebuiltDrinks] = useState<any[]>([]);



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

  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedDrinkTypeId && selectedSize) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/pricing?drink_type_id=${selectedDrinkTypeId}&size=${encodeURIComponent(selectedSize)}`
          );
          const data = await res.json();
          setBasePrice(data.price);
        } catch (err) {
          console.error("Failed to fetch price", err);
          setBasePrice(null);
        }
      } else {
        setBasePrice(null);
      }
    };
    fetchPrice();
  }, [selectedDrinkTypeId, selectedSize]);
  
  useEffect(() => {
    if (basePrice === null || isNaN(Number(basePrice))) {
      setTotalPrice(null);
      return;
    }
  
    let total: number = Number(basePrice);
  
    // --- Milk upcharge ---
    const milk = milkOptions.find((m) => m.name === selectedMilk);
    if (milk && typeof milk.price_adjustment === "number") {
      total += milk.price_adjustment;
    } else if (milk && milk.price_adjustment) {
      total += Number(milk.price_adjustment);
    }
  
    // --- Flavor upcharge (first 2 free) ---
    const extraFlavors = Math.max(0, selectedFlavors.length - 2);
    total += extraFlavors * 0.5;
  
    // --- Options (extras) ---
    const selectedExtraOptions = options.filter((opt) =>
      selectedOptions.includes(opt.id)
    );
    const optionsCost = selectedExtraOptions.reduce((sum, opt) => {
      const adj = typeof opt.price_adjustment === "number"
        ? opt.price_adjustment
        : Number(opt.price_adjustment) || 0;
      return sum + adj;
    }, 0);
    total += optionsCost;
  
    setTotalPrice(Number(total.toFixed(2)));
  }, [
    basePrice,
    selectedMilk,
    selectedFlavors,
    selectedOptions,
    milkOptions,
    options,
  ]);
  
  useEffect(() => {
    const fetchPrebuiltDrinks = async () => {
      const selectedDrink = drinkTypes.find((dt) => dt.id === selectedDrinkTypeId);
      if (selectedDrink?.name === "Select A Drink") {
        try {
          const res = await fetch("http://localhost:5000/api/prebuilt_drinks");
          const data = await res.json();
          setPrebuiltDrinks(data);
        } catch (err) {
          console.error("Failed to fetch prebuilt drinks", err);
        }
      } else {
        setPrebuiltDrinks([]);
      }
    };
    fetchPrebuiltDrinks();
  }, [selectedDrinkTypeId, drinkTypes]);

  const handleSelectPrebuiltDrink = (drink: any) => {
    const drinkType = drinkTypes.find(dt => dt.name.toLowerCase() === drink.drink_type_name.toLowerCase());
    const category = categories.find(cat => cat.name.toLowerCase() === drink.category_name.toLowerCase());
    const milk = milkOptions.find(m => m.name.toLowerCase() === drink.milk_name.toLowerCase());
    const shot = drinkShots.find(s => s.name.toLowerCase() === drink.shot_name?.toLowerCase());
  
    setSelectedCategoryId(category?.id || null);
    setSelectedDrinkTypeId(drinkType?.id || null);
    setSelectedSize(drink.size || null);
    setSelectedStyle(drink.style || null);
    setSelectedMilk(milk?.name || null);
    setSelectedShots(shot?.id || null);
    setSelectedFlavors(drink.flavor_ids || []);
    setSelectedOptions(drink.option_ids || []);
  };
  

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
          price: totalPrice,
          notes,
          orderName,
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


      //Delete order items
      const handleDeleteOrderItem = (index: number) => {
        setOrderItems((prev) => prev.filter((_, i) => i !== index));
      };
      
      //Edit order items
      const handleEditOrderItem = (index: number) => {
        const item = orderItems[index];
      
        setSelectedCategoryId(item.category?.id || null);
        setSelectedDrinkTypeId(item.drinkType?.id || null);
        setSelectedSize(item.size || null);
        setSelectedMilk(item.milk?.name || null);
        setSelectedStyle(item.style?.name || null);
        setSelectedShots(item.shots?.id || null);
        setSelectedFlavors(item.flavors.map((f: any) => f.id));
        setSelectedOptions(item.options.map((o: any) => o.id));
      
        // Optionally remove item from cart so it can be replaced after editing
        setOrderItems((prev) => prev.filter((_, i) => i !== index));
      };
      

      

    //View shots or hide on choice
      const selectedDrink = drinkTypes.find((dt) => dt.id === selectedDrinkTypeId);
      const espressoDrinks = [
        "Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha",
        "Breve", "Dirty Chai", "Drip Coffee"
      ];
      const requiresShots = selectedDrink ? espressoDrinks.includes(selectedDrink.name) : false;
      
    //Add to cart button
      const isOrderReady =
        selectedCategoryId !== null &&
        selectedDrinkTypeId !== null &&
        selectedSize !== null &&
        selectedStyle !== null &&
        selectedMilk !== null &&
        (!requiresShots || selectedShots !== null); 


    const selectedExtraOptions = options.filter((opt) =>
        selectedOptions.includes(opt.id)
        );
        
        const optionsCost = selectedExtraOptions.reduce((sum, opt) => {
        const adj =
            typeof opt.price_adjustment === "number"
            ? opt.price_adjustment
            : Number(opt.price_adjustment) || 0;
        return sum + adj;
        }, 0);
          

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

        {prebuiltDrinks.map((drink, index) => (
        <button
            key={index}
            onClick={() => handleSelectPrebuiltDrink(drink)}
            className="block w-full text-left border rounded p-4 bg-gray-50 shadow hover:bg-pink-100 transition"
        >
            <div className="font-bold">{drink.name}</div>
        </button>
        ))}



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
                <h3 className="italic mb-2 text-sm text-blue-700">Shots per size 12oz/16oz Double - 20oz Triple - 24oz/32oz Quad</h3>
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

            {typeof price === "number" && !isNaN(price) && (
            <div className="text-lg font-semibold text-green-700">
                Price: ${price.toFixed(2)}
            </div>
            )}
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
            {milkOptions.map((milk) => {
                let priceLabel = "";
                if (["Almond Milk", "Oat Milk", "Soy Milk"].includes(milk.name)) {
                priceLabel = " (+$0.75)";
                } else if (milk.name === "Lotus Cream") {
                priceLabel = " (+$0.50)";
                } else if (milk.name === "Heavy Cream") {
                priceLabel = " (+$1.00)";
                }

                return (
                <button
                    key={milk.id}
                    className={`px-4 py-2 rounded border ${
                    selectedMilk === milk.name ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedMilk(milk.name)}
                >
                    {milk.name}{priceLabel}
                </button>
                );
            })}
            </div>

            {typeof totalPrice === "number" && !isNaN(totalPrice) && (
            <div className="text-lg font-semibold text-green-700">
                Price: ${totalPrice.toFixed(2)}
            </div>
            )}

        </div>
        )}


        {/* 7. Flavors */}
        {selectedMilk && (
        <div>
            <h2 className="font-semibold">7. Add Flavors</h2>
            <h3 className="italic mb-2 text-sm text-blue-700">2 flavors per drink included. $0.50 for each additional flavor. </h3>

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

            {selectedFlavors.length > 0 && (
            <div className="mt-4 space-y-2">
                <div className="text-md text-black">
                <strong>Selected Flavors:</strong>{" "}
                <div className="text italic text-sm text-blue-700">
                    {flavors
                        .filter((f) => selectedFlavors.includes(f.id))
                        .map((f) => f.name)
                        .join(", ")}
                </div>
                </div>

                {selectedFlavors.length > 2 && (
                <div className="italic text-green-700">
                    {selectedFlavors.length - 2} extra flavor
                    {selectedFlavors.length - 2 > 1 ? "s" : ""} × $0.50 = $
                    {((selectedFlavors.length - 2) * 0.5).toFixed(2)}
                </div>
                )}
            </div>
            )}
        </div>
        )}

        {/* 8. Extras */}
        {selectedFlavors.length > 0 && (
        <div>
            <h2 className="font-semibold mb-2">8. Add Extras</h2>
            <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                <button
                    key={option.id}
                    className={`px-4 py-2 rounded border flex items-center gap-1 ${
                    isSelected ? "bg-pink-600 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() =>
                    setSelectedOptions((prev) =>
                        isSelected
                        ? prev.filter((id) => id !== option.id)
                        : [...prev, option.id]
                    )
                    }
                >
                    <span>{option.name}</span>
                    {option.price_adjustment > 0 && (
                    <span className="text-sm italic text-green-700">
                        (+${Number(option.price_adjustment || 0).toFixed(2)})
                    </span>
                    )}
                </button>
                );
            })}
            </div>

            {selectedExtraOptions.length > 0 && (
            <div className="mt-2 space-y-1">
                <div className="text-md text-black">
                <strong>Selected Extras:</strong>{" "}
                <div>
                <span className="italic text-sm text-blue-700">
                    {selectedExtraOptions.map((opt) => opt.name).join(", ")}
                </span>
                </div>
                </div>
                <div className="italic text-green-700">
                Extras total: ${optionsCost.toFixed(2)}
                </div>
            </div>
            )}

        <div>
            <label className="block font-semibold mb-1">Order Name </label>
            <textarea
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="name"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
            />
        </div>
            

        <div>
            <label className="block font-semibold mb-1">Special Notes</label>
            <textarea
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="e.g. no ice, light whip, extra hot"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
        </div>
        </div>
        )}

        {orderItems.length > 0 && (
        <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Current Order</h2>
            <ul className="space-y-4">
            {orderItems.map((item, index) => {
                const espressoDrinks = [
                "Americano", "Latte", "Signature Latte", "Mocha", "Signature Mocha",
                "Breve", "Dirty Chai", "Drip Coffee"
                ];
                const isEspresso = item.drinkType && espressoDrinks.includes(item.drinkType.name);

                return (
                <li key={index} className="p-4 bg-gray-100 rounded shadow">

                    {/* Order Name*/}
                    <div className="text-red-500 font-semibold text-md mt-2">
                    {item.orderName && (
                    <div className="text-lg italic text-blue-700">
                        Order Name: {item.orderName}
                    </div>
                    )}
                    </div>

                    <div>
                    <strong>{item.size}</strong> {item.drinkType?.name} ({item.category?.name})
                    </div>
                    <div>Style: {item.style?.name}</div>
                    <div>Milk: {item.milk?.name}</div>
                    {isEspresso && <div>Shot: {item.shots?.name}</div>}
                    {item.flavors.length > 0 && (
                    <div>Flavors: {item.flavors.map((f: any) => f.name).join(", ")}</div>
                    )}
                    {item.options.length > 0 && (
                    <>
                    <div>Extras: {item.options.map((o: any) => o.name).join(", ")}</div>
                    </>
                    )}

                    {/* Item Notes*/}
                    <div className="text-red-500 font-semibold text-md mt-2">
                    {item.notes && (
                    <div className="text-sm italic text-red-500">
                        Note: {item.notes}
                    </div>
                    )}
                    </div>

                    <div className="font-semibold text-green-700 mt-1">
                    Total: ${item.price?.toFixed(2)}
                    </div>

                    <div className="flex gap-2 mt-2">
                    <button
                        className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                        onClick={() => handleEditOrderItem(index)}
                    >
                        Edit
                    </button>
                    <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDeleteOrderItem(index)}
                    >
                        Delete
                    </button>
                    </div>
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
            ? "bg-white text-black border-1 rounded hover:bg-green-500 hover:text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        >
        Add to Order
        </button>

        {typeof totalPrice === "number" && !isNaN(totalPrice) && (
        <div className="text-lg font-semibold text-green-700">
            Total Price: ${totalPrice.toFixed(2)}
        </div>
        )}

        {/* Checkout Button */}
        <div className="mt-4 text-center">
        <button
            onClick={() => {
            if (orderItems.length > 0) {
                setIsCheckoutStarted(true);
                console.log("Proceeding to checkout", orderItems);
            }
            }}
            disabled={orderItems.length === 0}
            className={`px-6 py-3 border rounded transition ${
            orderItems.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-blue-700 hover:text-white"
            }`}
        >
            Proceed to Checkout
        </button>
        </div>

      </div>
    </div>
  );
};

export default OrderPage;
