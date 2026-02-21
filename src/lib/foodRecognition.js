import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse meal text using OpenAI to extract individual food items with quantities
 * Handles variants, typos, and Indian food context
 * 
 * @param {string|string[]} mealText - Single meal text or array of meal texts
 * @param {object} options - Configuration options
 * @returns {Promise<object>} Parsed food items with normalized names and quantities
 */
export async function parseMealText(mealText, options = {}) {
  const {
    batchMode = Array.isArray(mealText),
    includeContext = true,
  } = options;

  const meals = Array.isArray(mealText) ? mealText : [mealText];

  try {
    const prompt = buildPrompt(meals, includeContext);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages: [
        {
          role: 'system',
          content: getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent parsing
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Return single result or batch results
    return batchMode ? result : result.meals[0];
    
  } catch (error) {
    console.error('OpenAI parsing error:', error);
    throw new Error(`Failed to parse meal text: ${error.message}`);
  }
}

/**
 * Build the prompt for OpenAI based on meal texts
 */
function buildPrompt(meals, includeContext) {
  if (meals.length === 1) {
    return `Parse this meal entry and extract individual food items with quantities:

"${meals[0]}"

Return a JSON object with this structure:
{
  "meals": [{
    "items": [
      {
        "name": "standardized food name",
        "originalText": "text as entered",
        "quantity": "extracted quantity with unit",
        "confidence": "high|medium|low"
      }
    ]
  }]
}`;
  }

  // Batch mode
  return `Parse these ${meals.length} meal entries and extract individual food items with quantities:

${meals.map((meal, i) => `${i + 1}. "${meal}"`).join('\n')}

Return a JSON object with this structure:
{
  "meals": [
    {
      "items": [
        {
          "name": "standardized food name",
          "originalText": "text as entered",
          "quantity": "extracted quantity with unit",
          "confidence": "high|medium|low"
        }
      ]
    }
  ]
}`;
}

/**
 * System prompt for OpenAI with Indian food expertise
 */
function getSystemPrompt() {
  return `You are a nutrition expert specializing in Indian cuisine with deep knowledge of:
- Indian foods and regional variations (North Indian, South Indian, etc.)
- Hinglish and mixed language food names (e.g., "Aalo parathe", "puri aalo")
- Common typos and variations (e.g., "pasta", "paasta", "maggi", "maggie")
- Typical Indian meal patterns and serving sizes
- Wedding/party food ("Shadi ka khana") and special occasions
- Alcohol consumption

CRITICAL EXPANSIONS — always apply these:

1. "Shadi ka khana" / "Shadi ka kahana" / "wedding food":
   This is a very heavy North Indian wedding feast. ALWAYS expand to ALL of these items:
   - Tandoori roti (2 pieces)
   - Paneer butter masala / shahi paneer (1 cup)
   - Dal makhani (1 cup)
   - Pulao or rice (1 cup)
   - Raita (1/2 cup)
   - Samosa (2 pieces) — fried starters
   - Gulab jamun (2 pieces)
   - Jalebi (3 pieces)
   This is a very high-calorie meal (~1800–2200 kcal total). Use confidence: high.

2. "🍶" emoji:
   This ALWAYS means alcohol/drinks — NOT sake, NOT tea, NOT water.
   Expand to: "alcohol" (1 serving). Use name: "alcohol", quantity: "1 serving", confidence: high.
   If context hints at a specific drink (beer, whiskey, rum), use that instead.

3. "Shadi ka khana * 2" → double all quantities from the wedding feast expansion above.

Your task is to:
1. Parse meal entries into individual food items
2. Normalize food names to standard forms (prefer Indian names for Indian foods)
3. Extract quantities when mentioned (e.g., "Banana (2)" → "2 pieces")
4. Estimate standard serving sizes when not specified
5. Apply CRITICAL EXPANSIONS above before anything else

Rules:
- Use Indian names when appropriate: "roti" not "flatbread", "dal" not "lentils"
- Preserve Hindi/regional terms: "Aloo", "Gobi", "Paneer"
- Expand compound items: "Dal + sabzi + roti" → separate items
- For unclear items, use confidence: low and make best guess
- Always include quantity (estimate if not mentioned)

Output format: JSON only, no additional text.`;
}

// Full North Indian wedding feast breakdown — very heavy calorie event
const SHADI_KA_KHANA_ITEMS = [
  'Tandoori roti (2 pieces)',
  'Paneer butter masala (1 cup)',
  'Dal makhani (1 cup)',
  'Pulao (1 cup)',
  'Raita (1/2 cup)',
  'Samosa (2 pieces)',
  'Gulab jamun (2 pieces)',
  'Jalebi (3 pieces)',
];

/**
 * Process vague or special meal descriptions
 * Handles: "Shadi ka khana", "party food", emojis
 */
export function expandVagueMeal(mealText) {
  const lower = mealText.toLowerCase();

  // Shadi ka khana — double portions if "* 2" or "x2" is mentioned
  if (lower.includes('shadi ka khana') || lower.includes('shadi ka kahana') || lower.includes('wedding food')) {
    const isDouble = /\*\s*2|x2|\b2x\b/i.test(mealText);
    if (isDouble) {
      return SHADI_KA_KHANA_ITEMS.map(item => item.replace(/\((\d+)/g, (_, n) => `(${parseInt(n) * 2}`));
    }
    return [...SHADI_KA_KHANA_ITEMS];
  }

  const expansions = {
    '🍶': ['Alcohol (1 serving)'],   // sake emoji = alcohol in this context
    'party food': ['Samosa (2 pieces)', 'Pakora (4 pieces)', 'Pizza (1 slice)', 'Sandwich (1)', 'Soft drink (1 glass)'],
    '🍕': ['Pizza (1 slice)'],
    '🍝': ['Pasta (1 cup)'],
    '🍔': ['Burger (1)'],
    '☕': ['Coffee (1 cup)'],
    '🍵': ['Tea (1 cup)'],
  };

  for (const [key, value] of Object.entries(expansions)) {
    if (lower.includes(key) || mealText.includes(key)) {
      return value;
    }
  }

  return null;
}

/**
 * Batch process multiple meals efficiently
 * Recommended: 10-20 meals per batch to optimize cost
 */
export async function batchParseMeals(meals, batchSize = 15) {
  const results = [];
  
  for (let i = 0; i < meals.length; i += batchSize) {
    const batch = meals.slice(i, i + batchSize);
    const batchResult = await parseMealText(batch, { batchMode: true });
    results.push(...batchResult.meals);
    
    // Small delay to respect rate limits
    if (i + batchSize < meals.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Estimate cost for parsing meals
 */
export function estimateCost(mealCount) {
  // GPT-4o-mini pricing: $0.15 per 1M input tokens, $0.60 per 1M output tokens
  const avgInputTokensPerMeal = 50;
  const avgOutputTokensPerMeal = 80;
  
  const inputCost = (mealCount * avgInputTokensPerMeal / 1000000) * 0.15;
  const outputCost = (mealCount * avgOutputTokensPerMeal / 1000000) * 0.60;
  
  return {
    totalCost: inputCost + outputCost,
    inputCost,
    outputCost,
    estimatedTime: Math.ceil(mealCount / 15) * 3, // seconds
  };
}
