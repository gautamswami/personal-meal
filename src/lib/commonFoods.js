// Common Indian foods preloaded database with nutrition data
// Source: Indian Nutrient Databank (INDB) and USDA database

export const commonFoodsData = [
  // Grains & Breads
  {
    name: "roti",
    aliases: ["chapati", "rotti", "indian bread", "phulka"],
    calories: 120,
    protein: 3.1,
    carbs: 22,
    fat: 2.7,
    fiber: 2.1,
    servingSize: "1 piece (40g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "rice",
    aliases: ["white rice", "steamed rice", "plain rice", "chawal"],
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    servingSize: "1 cup cooked (158g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "naan",
    aliases: ["naan bread", "butter naan"],
    calories: 262,
    protein: 7.6,
    carbs: 45,
    fat: 5.2,
    fiber: 2.4,
    servingSize: "1 piece (90g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "paratha",
    aliases: ["aloo paratha", "plain paratha", "stuffed paratha"],
    calories: 250,
    protein: 5.5,
    carbs: 35,
    fat: 9.5,
    fiber: 3.2,
    servingSize: "1 piece (70g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "poha",
    aliases: ["flattened rice", "beaten rice", "chivda"],
    calories: 180,
    protein: 4.2,
    carbs: 38,
    fat: 1.5,
    fiber: 1.8,
    servingSize: "1 cup (100g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "upma",
    aliases: ["rava upma", "semolina upma", "sooji upma"],
    calories: 195,
    protein: 5.3,
    carbs: 32,
    fat: 5.2,
    fiber: 2.1,
    servingSize: "1 cup (150g)",
    category: "grains",
    isIndian: true
  },

  // Legumes & Lentils
  {
    name: "dal",
    aliases: ["lentils", "daal", "toor dal", "yellow dal", "moong dal"],
    calories: 140,
    protein: 9.5,
    carbs: 20,
    fat: 0.8,
    fiber: 8.2,
    servingSize: "1 cup cooked (200g)",
    category: "legumes",
    isIndian: true
  },
  {
    name: "rajma",
    aliases: ["kidney beans", "red beans", "rajma curry"],
    calories: 140,
    protein: 8.7,
    carbs: 25,
    fat: 0.5,
    fiber: 7.4,
    servingSize: "1 cup cooked (200g)",
    category: "legumes",
    isIndian: true
  },
  {
    name: "chole",
    aliases: ["chickpeas", "chana", "garbanzo beans", "chana masala"],
    calories: 164,
    protein: 8.9,
    carbs: 27,
    fat: 2.6,
    fiber: 7.6,
    servingSize: "1 cup cooked (200g)",
    category: "legumes",
    isIndian: true
  },
  {
    name: "chana",
    aliases: ["chickpeas", "chole", "kabuli chana"],
    calories: 164,
    protein: 8.9,
    carbs: 27,
    fat: 2.6,
    fiber: 7.6,
    servingSize: "1 cup cooked (200g)",
    category: "legumes",
    isIndian: true
  },

  // Vegetables
  {
    name: "aloo",
    aliases: ["potato", "potatoes", "batata", "aalu"],
    calories: 110,
    protein: 2.6,
    carbs: 26,
    fat: 0.1,
    fiber: 2.4,
    servingSize: "1 medium (150g)",
    category: "vegetables",
    isIndian: true
  },
  {
    name: "paneer",
    aliases: ["cottage cheese", "indian cheese"],
    calories: 265,
    protein: 18.3,
    carbs: 3.6,
    fat: 20.8,
    fiber: 0,
    servingSize: "100g",
    category: "protein",
    isIndian: true
  },
  {
    name: "gobi",
    aliases: ["cauliflower", "phool gobi"],
    calories: 25,
    protein: 1.9,
    carbs: 5,
    fat: 0.3,
    fiber: 2,
    servingSize: "1 cup (100g)",
    category: "vegetables",
    isIndian: true
  },
  {
    name: "sabzi",
    aliases: ["vegetables", "mixed vegetables", "vegetable curry"],
    calories: 85,
    protein: 2.5,
    carbs: 15,
    fat: 2.5,
    fiber: 4.2,
    servingSize: "1 cup (150g)",
    category: "vegetables",
    isIndian: true
  },

  // Fruits
  {
    name: "banana",
    aliases: ["kela", "bananas"],
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    servingSize: "1 medium (118g)",
    category: "fruits",
    isIndian: false
  },
  {
    name: "apple",
    aliases: ["seb", "apples"],
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    servingSize: "1 medium (182g)",
    category: "fruits",
    isIndian: false
  },
  {
    name: "papaya",
    aliases: ["papita", "pawpaw"],
    calories: 43,
    protein: 0.5,
    carbs: 11,
    fat: 0.3,
    fiber: 1.7,
    servingSize: "1 cup cubed (140g)",
    category: "fruits",
    isIndian: false
  },
  {
    name: "mango",
    aliases: ["aam", "mangoes"],
    calories: 99,
    protein: 1.4,
    carbs: 25,
    fat: 0.6,
    fiber: 2.6,
    servingSize: "1 cup sliced (165g)",
    category: "fruits",
    isIndian: false
  },
  {
    name: "orange",
    aliases: ["oranges", "narangi", "santra"],
    calories: 62,
    protein: 1.2,
    carbs: 15,
    fat: 0.2,
    fiber: 3.1,
    servingSize: "1 medium (131g)",
    category: "fruits",
    isIndian: false
  },
  {
    name: "watermelon",
    aliases: ["tarbooz", "tarbuj"],
    calories: 46,
    protein: 0.9,
    carbs: 11,
    fat: 0.2,
    fiber: 0.6,
    servingSize: "1 cup cubed (152g)",
    category: "fruits",
    isIndian: false
  },
  {
    name: "muskmelon",
    aliases: ["cantaloupe", "kharbuja"],
    calories: 53,
    protein: 1.3,
    carbs: 13,
    fat: 0.3,
    fiber: 1.4,
    servingSize: "1 cup cubed (156g)",
    category: "fruits",
    isIndian: false
  },

  // Proteins
  {
    name: "egg",
    aliases: ["eggs", "boiled egg", "anda"],
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    fiber: 0,
    servingSize: "1 large (50g)",
    category: "protein",
    isIndian: false
  },
  {
    name: "chicken",
    aliases: ["chicken breast", "murga", "murg"],
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    servingSize: "100g cooked",
    category: "protein",
    isIndian: false
  },
  {
    name: "fish",
    aliases: ["machli", "fish fillet"],
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    servingSize: "100g cooked",
    category: "protein",
    isIndian: false
  },

  // Dairy
  {
    name: "milk",
    aliases: ["doodh", "whole milk"],
    calories: 103,
    protein: 8.1,
    carbs: 12,
    fat: 2.4,
    fiber: 0,
    servingSize: "1 cup (240ml)",
    category: "dairy",
    isIndian: false
  },
  {
    name: "curd",
    aliases: ["yogurt", "dahi", "yoghurt"],
    calories: 59,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    fiber: 0,
    servingSize: "100g",
    category: "dairy",
    isIndian: true
  },
  {
    name: "ghee",
    aliases: ["clarified butter"],
    calories: 112,
    protein: 0,
    carbs: 0,
    fat: 12.7,
    fiber: 0,
    servingSize: "1 tbsp (14g)",
    category: "fats",
    isIndian: true
  },

  // Snacks
  {
    name: "samosa",
    aliases: ["samosas", "aloo samosa"],
    calories: 252,
    protein: 4.5,
    carbs: 28,
    fat: 13,
    fiber: 2.3,
    servingSize: "1 piece (85g)",
    category: "snacks",
    isIndian: true
  },
  {
    name: "pakora",
    aliases: ["bhaji", "fritters", "pakoda"],
    calories: 165,
    protein: 3.8,
    carbs: 18,
    fat: 8.5,
    fiber: 2.1,
    servingSize: "4 pieces (80g)",
    category: "snacks",
    isIndian: true
  },
  {
    name: "bread",
    aliases: ["white bread", "brown bread", "pav"],
    calories: 79,
    protein: 2.7,
    carbs: 15,
    fat: 1,
    fiber: 0.8,
    servingSize: "1 slice (30g)",
    category: "grains",
    isIndian: false
  },
  {
    name: "biscuit",
    aliases: ["cookies", "biscuits"],
    calories: 50,
    protein: 0.7,
    carbs: 7.2,
    fat: 2.1,
    fiber: 0.2,
    servingSize: "1 piece (10g)",
    category: "snacks",
    isIndian: false
  },

  // Beverages
  {
    name: "tea",
    aliases: ["chai", "indian tea", "masala chai"],
    calories: 30,
    protein: 0.7,
    carbs: 5.5,
    fat: 0.8,
    fiber: 0,
    servingSize: "1 cup (240ml)",
    category: "beverages",
    isIndian: true
  },
  {
    name: "coffee",
    aliases: ["black coffee", "koffee"],
    calories: 2,
    protein: 0.3,
    carbs: 0,
    fat: 0,
    fiber: 0,
    servingSize: "1 cup (240ml)",
    category: "beverages",
    isIndian: false
  },
  {
    name: "lassi",
    aliases: ["buttermilk", "sweet lassi", "mango lassi"],
    calories: 142,
    protein: 8.1,
    carbs: 20,
    fat: 3.3,
    fiber: 0,
    servingSize: "1 cup (240ml)",
    category: "beverages",
    isIndian: true
  },

  // Additional Common Items
  {
    name: "pizza",
    aliases: ["cheese pizza", "pizza slice"],
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    fiber: 2.5,
    servingSize: "1 slice (107g)",
    category: "snacks",
    isIndian: false
  },
  {
    name: "pasta",
    aliases: ["spaghetti", "noodles", "white sauce pasta", "red sauce pasta"],
    calories: 220,
    protein: 8,
    carbs: 43,
    fat: 1.3,
    fiber: 2.5,
    servingSize: "1 cup cooked (140g)",
    category: "grains",
    isIndian: false
  },
  {
    name: "sandwich",
    aliases: ["veg sandwich", "cheese sandwich"],
    calories: 250,
    protein: 9,
    carbs: 35,
    fat: 8,
    fiber: 3,
    servingSize: "1 sandwich",
    category: "snacks",
    isIndian: false
  },
  {
    name: "maggi",
    aliases: ["instant noodles", "2-minute noodles", "maggie"],
    calories: 310,
    protein: 8,
    carbs: 46,
    fat: 11,
    fiber: 2,
    servingSize: "1 pack (70g)",
    category: "snacks",
    isIndian: true
  },
  {
    name: "dosa",
    aliases: ["plain dosa", "masala dosa", "dosai"],
    calories: 133,
    protein: 2.6,
    carbs: 24,
    fat: 2.8,
    fiber: 1.2,
    servingSize: "1 dosa (60g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "idli",
    aliases: ["idly", "steamed rice cake"],
    calories: 39,
    protein: 1.2,
    carbs: 8,
    fat: 0.2,
    fiber: 0.8,
    servingSize: "1 idli (30g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "vada",
    aliases: ["medu vada", "urad vada", "vadai"],
    calories: 145,
    protein: 4.2,
    carbs: 15,
    fat: 7.8,
    fiber: 2.1,
    servingSize: "1 piece (50g)",
    category: "snacks",
    isIndian: true
  },
  {
    name: "puri",
    aliases: ["poori", "fried bread"],
    calories: 115,
    protein: 2.1,
    carbs: 14,
    fat: 5.9,
    fiber: 1.2,
    servingSize: "1 piece (30g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "biryani",
    aliases: ["dum biryani", "chicken biryani", "veg biryani"],
    calories: 290,
    protein: 8.5,
    carbs: 45,
    fat: 8.5,
    fiber: 2.3,
    servingSize: "1 cup (200g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "oats",
    aliases: ["oatmeal", "vegetable oats"],
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    servingSize: "1 cup cooked (234g)",
    category: "grains",
    isIndian: false
  },
  {
    name: "sprouts",
    aliases: ["moong sprouts", "sprouted beans"],
    calories: 31,
    protein: 3,
    carbs: 6,
    fat: 0.2,
    fiber: 1.8,
    servingSize: "1 cup (104g)",
    category: "legumes",
    isIndian: true
  },
  {
    name: "soup",
    aliases: ["vegetable soup", "tomato soup"],
    calories: 75,
    protein: 2.5,
    carbs: 12,
    fat: 2,
    fiber: 2.5,
    servingSize: "1 cup (240ml)",
    category: "vegetables",
    isIndian: false
  },
  {
    name: "salad",
    aliases: ["green salad", "mixed salad", "veg salad"],
    calories: 45,
    protein: 2,
    carbs: 9,
    fat: 0.5,
    fiber: 3,
    servingSize: "1 cup (100g)",
    category: "vegetables",
    isIndian: false
  },
  {
    name: "icecream",
    aliases: ["ice cream", "ice-cream", "kulfi"],
    calories: 207,
    protein: 3.5,
    carbs: 24,
    fat: 11,
    fiber: 0.7,
    servingSize: "1/2 cup (66g)",
    category: "dessert",
    isIndian: false
  },

  // --- Wedding / rich Indian dishes ---
  {
    name: "dal makhani",
    aliases: ["dal makhni", "makhani dal", "black dal", "kali dal"],
    calories: 255,
    protein: 9.2,
    carbs: 28,
    fat: 12.5,
    fiber: 6.1,
    servingSize: "1 cup (200g)",
    category: "legumes",
    isIndian: true
  },
  {
    name: "paneer butter masala",
    aliases: ["shahi paneer", "paneer makhani", "butter paneer", "paneer gravy"],
    calories: 350,
    protein: 14,
    carbs: 18,
    fat: 24,
    fiber: 2.5,
    servingSize: "1 cup (200g)",
    category: "protein",
    isIndian: true
  },
  {
    name: "tandoori roti",
    aliases: ["tandoor roti", "clay oven roti"],
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 2.8,
    servingSize: "1 piece (55g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "pulao",
    aliases: ["jeera rice", "pilaf", "veg pulao", "vegetable pulao"],
    calories: 250,
    protein: 4.8,
    carbs: 46,
    fat: 5.5,
    fiber: 1.8,
    servingSize: "1 cup (185g)",
    category: "grains",
    isIndian: true
  },
  {
    name: "raita",
    aliases: ["boondi raita", "cucumber raita", "dahi raita"],
    calories: 65,
    protein: 3.2,
    carbs: 7.5,
    fat: 2.5,
    fiber: 0.4,
    servingSize: "1/2 cup (120g)",
    category: "dairy",
    isIndian: true
  },
  {
    name: "gulab jamun",
    aliases: ["gulabjamun", "gulab-jamun"],
    calories: 175,
    protein: 3.5,
    carbs: 28,
    fat: 6,
    fiber: 0.3,
    servingSize: "2 pieces (80g)",
    category: "dessert",
    isIndian: true
  },
  {
    name: "jalebi",
    aliases: ["jalebi sweet", "crispy jalebi"],
    calories: 150,
    protein: 1.8,
    carbs: 30,
    fat: 3.5,
    fiber: 0.2,
    servingSize: "3 pieces (50g)",
    category: "dessert",
    isIndian: true
  },
  {
    name: "kheer",
    aliases: ["rice kheer", "rice pudding", "payasam"],
    calories: 185,
    protein: 5.5,
    carbs: 32,
    fat: 4.5,
    fiber: 0.3,
    servingSize: "1/2 cup (150g)",
    category: "dessert",
    isIndian: true
  },
  {
    name: "ladoo",
    aliases: ["laddoo", "besan ladoo", "motichoor ladoo", "laddu"],
    calories: 195,
    protein: 4.2,
    carbs: 25,
    fat: 9,
    fiber: 1.2,
    servingSize: "1 piece (50g)",
    category: "dessert",
    isIndian: true
  },
  {
    name: "sev",
    aliases: ["besan sev", "nylon sev", "gathiya"],
    calories: 545,
    protein: 13.5,
    carbs: 56,
    fat: 30,
    fiber: 5.2,
    servingSize: "100g",
    category: "snacks",
    isIndian: true
  },
  {
    name: "roll",
    aliases: ["kathi roll", "frankie roll", "rolls king", "veg roll", "paneer roll"],
    calories: 320,
    protein: 9,
    carbs: 45,
    fat: 11,
    fiber: 3.5,
    servingSize: "1 roll (150g)",
    category: "snacks",
    isIndian: true
  },

  // --- Alcohol ---
  {
    name: "alcohol",
    aliases: ["🍶", "drink", "drinks", "alcoholic drink", "booze", "liquor", "daru", "daaru", "sharab"],
    calories: 155,
    protein: 0,
    carbs: 13,
    fat: 0,
    fiber: 0,
    servingSize: "1 serving (330ml beer / 60ml spirits)",
    category: "beverages",
    isIndian: false
  },
  {
    name: "beer",
    aliases: ["bira", "kingfisher", "lager", "cold beer"],
    calories: 154,
    protein: 1.3,
    carbs: 12.6,
    fat: 0,
    fiber: 0,
    servingSize: "1 can/bottle (330ml)",
    category: "beverages",
    isIndian: false
  },
  {
    name: "whiskey",
    aliases: ["whisky", "scotch", "bourbon", "peg", "whiskey soda"],
    calories: 250,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    servingSize: "2 pegs (60ml neat)",
    category: "beverages",
    isIndian: false
  }
];

// Helper function to find food by name or alias
export function findCommonFood(searchTerm) {
  if (!searchTerm) return null;
  
  const normalized = searchTerm.toLowerCase().trim();
  
  return commonFoodsData.find(food => 
    food.name === normalized || 
    food.aliases.some(alias => alias.toLowerCase() === normalized)
  );
}

// Helper function to search foods (fuzzy matching)
export function searchCommonFoods(searchTerm) {
  if (!searchTerm) return [];
  
  const normalized = searchTerm.toLowerCase().trim();
  
  return commonFoodsData.filter(food =>
    food.name.includes(normalized) ||
    food.aliases.some(alias => alias.toLowerCase().includes(normalized))
  );
}
