import clientPromise from './mongodb';
import { findCommonFood, searchCommonFoods } from './commonFoods';

/**
 * Three-tier caching system for nutrition data:
 * Tier 1: Preloaded common foods (instant, 5-10ms)
 * Tier 2: MongoDB cache (fast, 10-50ms)
 * Tier 3: INDB API / OpenAI estimation (slow, 2-3s, then cached)
 */

/**
 * Get nutrition data for a food item
 * Checks all three tiers before making external API calls
 */
export async function getNutritionData(foodName, quantity = null) {
  // Tier 1: Check preloaded common foods
  const commonFood = findCommonFood(foodName);
  if (commonFood) {
    return {
      ...commonFood,
      quantity: quantity || commonFood.servingSize,
      source: 'tier1-preloaded',
      cached: true
    };
  }

  // Tier 2: Check MongoDB cache
  const cachedData = await checkNutritionCache(foodName);
  if (cachedData) {
    await incrementHitCount(foodName);
    return {
      ...cachedData,
      quantity: quantity || cachedData.servingSize,
      source: 'tier2-cached',
      cached: true
    };
  }

  // Tier 3: Fetch from external sources
  const nutritionData = await fetchFromExternalSource(foodName);
  
  // Cache the result
  await cacheNutritionData(foodName, nutritionData);
  
  return {
    ...nutritionData,
    quantity: quantity || nutritionData.servingSize,
    source: 'tier3-external',
    cached: false
  };
}

/**
 * Batch get nutrition data for multiple food items
 */
export async function getBatchNutritionData(foodItems) {
  const results = await Promise.all(
    foodItems.map(item => 
      getNutritionData(
        typeof item === 'string' ? item : item.name,
        typeof item === 'object' ? item.quantity : null
      )
    )
  );
  
  return results;
}

/**
 * Check Tier 2: MongoDB nutrition cache
 */
async function checkNutritionCache(foodName) {
  try {
    const client = await clientPromise;
    const db = client.db('mealplan');
    const cache = db.collection('nutritionCache');

    const normalized = foodName.toLowerCase().trim();
    
    const cached = await cache.findOne({
      $or: [
        { foodName: normalized },
        { normalizedName: normalized },
        { aliases: normalized }
      ]
    });

    if (cached) {
      return {
        name: cached.foodName,
        calories: cached.calories,
        protein: cached.protein,
        carbs: cached.carbs,
        fat: cached.fat,
        fiber: cached.fiber || 0,
        servingSize: cached.servingSize,
        category: cached.category,
        hitCount: cached.hitCount || 0
      };
    }

    return null;
  } catch (error) {
    console.error('Cache check error:', error);
    return null;
  }
}

/**
 * Increment hit count for popular items (helps identify foods for Tier 1)
 */
async function incrementHitCount(foodName) {
  try {
    const client = await clientPromise;
    const db = client.db('mealplan');
    const cache = db.collection('nutritionCache');

    const normalized = foodName.toLowerCase().trim();

    await cache.updateOne(
      { foodName: normalized },
      { 
        $inc: { hitCount: 1 },
        $set: { lastUsed: new Date() }
      }
    );
  } catch (error) {
    console.error('Hit count update error:', error);
  }
}

/**
 * Cache nutrition data in MongoDB
 */
async function cacheNutritionData(foodName, nutritionData) {
  try {
    const client = await clientPromise;
    const db = client.db('mealplan');
    const cache = db.collection('nutritionCache');

    const normalized = foodName.toLowerCase().trim();

    await cache.updateOne(
      { foodName: normalized },
      {
        $set: {
          ...nutritionData,
          foodName: normalized,
          lastUsed: new Date(),
          sharedAcrossUsers: true
        },
        $setOnInsert: {
          hitCount: 0,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Cache save error:', error);
  }
}

/**
 * Tier 3: Fetch from external sources (INDB or estimation)
 * For now using estimated values, can integrate INDB API later
 */
async function fetchFromExternalSource(foodName) {
  // Try to find similar items in common foods for estimation
  const similar = searchCommonFoods(foodName);
  
  if (similar.length > 0) {
    // Use the first similar item as base estimation
    const base = similar[0];
    return {
      name: foodName,
      calories: base.calories,
      protein: base.protein,
      carbs: base.carbs,
      fat: base.fat,
      fiber: base.fiber || 0,
      servingSize: base.servingSize,
      category: base.category,
      estimated: true,
      basedOn: base.name
    };
  }

  // Default estimation for unknown foods
  return {
    name: foodName,
    calories: 150, // Average estimate
    protein: 5,
    carbs: 20,
    fat: 5,
    fiber: 2,
    servingSize: '1 serving',
    category: 'unknown',
    estimated: true,
    needsReview: true
  };
}

/**
 * Calculate total nutrition for a meal
 */
export function calculateMealNutrition(foodItems) {
  return foodItems.reduce((total, item) => {
    const multiplier = parseQuantityMultiplier(item.quantity);
    
    return {
      calories: total.calories + (item.calories * multiplier),
      protein: total.protein + (item.protein * multiplier),
      carbs: total.carbs + (item.carbs * multiplier),
      fat: total.fat + (item.fat * multiplier),
      fiber: total.fiber + ((item.fiber || 0) * multiplier)
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
}

/**
 * Parse quantity to get multiplier
 * Examples: "2 pieces" → 2, "1 cup" → 1, "half" → 0.5
 */
function parseQuantityMultiplier(quantity) {
  if (!quantity) return 1;
  
  const str = quantity.toLowerCase();
  
  // Look for numbers
  const numMatch = str.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }
  
  // Handle fractions
  if (str.includes('half') || str.includes('1/2')) return 0.5;
  if (str.includes('quarter') || str.includes('1/4')) return 0.25;
  if (str.includes('third') || str.includes('1/3')) return 0.33;
  
  return 1;
}

/**
 * Get most popular cached foods (for potential Tier 1 promotion)
 */
export async function getMostPopularFoods(limit = 20) {
  try {
    const client = await clientPromise;
    const db = client.db('mealplan');
    const cache = db.collection('nutritionCache');

    const popular = await cache
      .find({})
      .sort({ hitCount: -1 })
      .limit(limit)
      .toArray();

    return popular;
  } catch (error) {
    console.error('Popular foods fetch error:', error);
    return [];
  }
}

/**
 * Initialize/seed common foods into MongoDB
 * Should be run once during setup
 */
export async function seedCommonFoods() {
  try {
    const { commonFoodsData } = await import('./commonFoods');
    const client = await clientPromise;
    const db = client.db('mealplan');
    const cache = db.collection('nutritionCache');

    const operations = commonFoodsData.map(food => ({
      updateOne: {
        filter: { foodName: food.name },
        update: {
          $setOnInsert: {
            ...food,
            foodName: food.name,
            hitCount: 0,
            createdAt: new Date(),
            sharedAcrossUsers: true,
            preloaded: true
          }
        },
        upsert: true
      }
    }));

    const result = await cache.bulkWrite(operations);
    
    return {
      success: true,
      inserted: result.upsertedCount,
      modified: result.modifiedCount
    };
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}
