// src/types.ts

export type CustomOption = {
    name: string;
    price: number;
  };
  
  export type DrinkCategory =  "Espresso" | "Energy" | "Tea" | "Soda"| "Other";

  export type DrinkTypeEspresso = "Latte" | "Mocha" | "Breve" | "Americano" | "Cold Brew" | "Straight Shot";
  export type DrinkTypeEnergy = "Lotus" | "Redbull";
  export type DrinkTypeTea = "Chai Tea";
  export type DrinkTypeOther = "Hot Chocolate" | "Italian Soda";
  
  export type Drink = {
    id: number;
    name: string;
    basePrice: number;
    category: DrinkCategory;
    sizes: CustomOption[];
    milkOptions?: CustomOption[];
    flavorShots?: CustomOption[];
    addOns?: CustomOption[];
    isIcedOrHot?: boolean;
  };
  
  
  export type SelectedCustomization = {
    size: CustomOption;
    milk?: CustomOption;
    flavors?: CustomOption[];  
    addOns?: CustomOption[];    
    temp?: "Iced" | "Hot";
    shots?: number;        
  };
  
  export type CartItem = {
    drink: Drink;
    customizations: SelectedCustomization;
    totalPrice: number;
  };
  