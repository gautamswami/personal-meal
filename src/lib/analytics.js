import { parseISO, format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { getBatchNutritionData, calculateMealNutrition } from './nutritionData';

/**
 * Analyze daily meals and calculate nutrition totals
 */
export async function analyzeDailyMeals(mealsForDay) {
  if (!mealsForDay || mealsForDay.length === 0) {
    return {
      totalCalories: 0,
      macros: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
      meals: [],
      mealCount: 0
    };
  }

  const analyzedMeals = [];
  let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  for (const meal of mealsForDay) {
    const mealAnalysis = {
      type: meal.type || 'other',
      time: meal.time,
      items: [],
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    };

    if (meal.items && meal.items.length > 0) {
      // Get nutrition for all items
      const nutritionData = await getBatchNutritionData(meal.items);
      
      mealAnalysis.items = meal.items.map((item, index) => ({
        name: item.name,
        originalText: item.originalText || item.name,
        quantity: item.quantity,
        ...nutritionData[index]
      }));

      // Calculate meal nutrition
      mealAnalysis.nutrition = calculateMealNutrition(nutritionData);
    }

    analyzedMeals.push(mealAnalysis);
    
    // Add to daily total
    totalNutrition.calories += mealAnalysis.nutrition.calories;
    totalNutrition.protein += mealAnalysis.nutrition.protein;
    totalNutrition.carbs += mealAnalysis.nutrition.carbs;
    totalNutrition.fat += mealAnalysis.nutrition.fat;
    totalNutrition.fiber += mealAnalysis.nutrition.fiber;
  }

  return {
    totalCalories: Math.round(totalNutrition.calories),
    macros: {
      protein: Math.round(totalNutrition.protein * 10) / 10,
      carbs: Math.round(totalNutrition.carbs * 10) / 10,
      fat: Math.round(totalNutrition.fat * 10) / 10,
      fiber: Math.round(totalNutrition.fiber * 10) / 10
    },
    meals: analyzedMeals,
    mealCount: analyzedMeals.length
  };
}

/**
 * Analyze weekly meals
 */
export async function analyzeWeeklyMeals(allMeals, startDate, endDate) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  const daysInRange = eachDayOfInterval({ start, end });
  
  const dailyAnalyses = [];
  let weekTotal = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, mealCount: 0 };

  for (const day of daysInRange) {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayMeals = allMeals.filter(m => m.date === dateStr);
    
    const dayAnalysis = await analyzeDailyMeals(dayMeals);
    
    dailyAnalyses.push({
      date: dateStr,
      ...dayAnalysis
    });

    weekTotal.calories += dayAnalysis.totalCalories;
    weekTotal.protein += dayAnalysis.macros.protein;
    weekTotal.carbs += dayAnalysis.macros.carbs;
    weekTotal.fat += dayAnalysis.macros.fat;
    weekTotal.fiber += dayAnalysis.macros.fiber;
    weekTotal.mealCount += dayAnalysis.mealCount;
  }

  const daysWithMeals = dailyAnalyses.filter(d => d.mealCount > 0).length;

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
    days: dailyAnalyses,
    summary: {
      totalCalories: Math.round(weekTotal.calories),
      averageCalories: daysWithMeals > 0 ? Math.round(weekTotal.calories / daysWithMeals) : 0,
      totalMeals: weekTotal.mealCount,
      averageMealsPerDay: daysWithMeals > 0 ? Math.round((weekTotal.mealCount / daysWithMeals) * 10) / 10 : 0,
      averageMacros: {
        protein: daysWithMeals > 0 ? Math.round((weekTotal.protein / daysWithMeals) * 10) / 10 : 0,
        carbs: daysWithMeals > 0 ? Math.round((weekTotal.carbs / daysWithMeals) * 10) / 10 : 0,
        fat: daysWithMeals > 0 ? Math.round((weekTotal.fat / daysWithMeals) * 10) / 10 : 0,
        fiber: daysWithMeals > 0 ? Math.round((weekTotal.fiber / daysWithMeals) * 10) / 10 : 0
      }
    }
  };
}

/**
 * Detect eating patterns and irregularities
 */
export function detectPatterns(dailyAnalyses) {
  const patterns = {
    lateNightEating: [],
    skippedMeals: [],
    irregularTimings: [],
    highCalorieDays: [],
    lowCalorieDays: []
  };

  for (const day of dailyAnalyses) {
    // Late night eating detection (after 10 PM)
    const lateNightMeals = day.meals?.filter(m => {
      if (!m.time) return false;
      const hour = parseTimeToHour(m.time);
      return hour >= 22 || hour < 4; // 10 PM to 4 AM
    }) || [];
    
    if (lateNightMeals.length > 0) {
      patterns.lateNightEating.push({
        date: day.date,
        meals: lateNightMeals.map(m => ({time: m.time, type: m.type}))
      });
    }

    // Skipped meals detection (less than 2 meals per day)
    if (day.mealCount > 0 && day.mealCount < 2) {
      patterns.skippedMeals.push({
        date: day.date,
        mealCount: day.mealCount
      });
    }

    // High calorie days (>2500 cal)
    if (day.totalCalories > 2500) {
      patterns.highCalorieDays.push({
        date: day.date,
        calories: day.totalCalories
      });
    }

    // Low calorie days (<1200 cal, excluding zero)
    if (day.totalCalories > 0 && day.totalCalories < 1200) {
      patterns.lowCalorieDays.push({
        date: day.date,
        calories: day.totalCalories
      });
    }
  }

  return patterns;
}

/**
 * Parse time string to hour (24-hour format)
 */
function parseTimeToHour(timeStr) {
  const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
  if (!match) return 12; // Default to noon if can't parse

  let hour = parseInt(match[1]);
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  return hour;
}

/**
 * Generate insights from analysis
 */
export function generateInsights(weeklyAnalysis, patterns) {
  const insights = [];

  // Average calorie insight
  const avgCal = weeklyAnalysis.summary.averageCalories;
  if (avgCal > 0) {
    if (avgCal < 1500) {
      insights.push({
        type: 'warning',
        category: 'calories',
        message: `Your average daily intake is ${avgCal} calories, which may be below recommended levels.`,
        recommendation: 'Consider adding more nutrient-dense foods to your meals.'
      });
    } else if (avgCal > 2500) {
      insights.push({
        type: 'info',
        category: 'calories',
        message: `Your average daily intake is ${avgCal} calories.`,
        recommendation: 'Monitor portion sizes if weight management is a goal.'
      });
    } else {
      insights.push({
        type: 'positive',
        category: 'calories',
        message: `Your calorie intake of ${avgCal} calories/day is within a healthy range.`
      });
    }
  }

  // Protein insight
  const avgProtein = weeklyAnalysis.summary.averageMacros.protein;
  if (avgProtein < 40) {
    insights.push({
      type: 'warning',
      category: 'protein',
      message: `Your protein intake averages ${avgProtein}g per day, which is below recommended levels.`,
      recommendation: 'Add more protein-rich foods like dal, paneer, eggs, or chicken.'
    });
  } else if (avgProtein >= 50) {
    insights.push({
      type: 'positive',
      category: 'protein',
      message: `Good protein intake! Averaging ${avgProtein}g per day.`
    });
  }

  // Late night eating
  if (patterns.lateNightEating.length > 0) {
    insights.push({
      type: 'warning',
      category: 'timing',
      message: `You ate late at night on ${patterns.lateNightEating.length} days this week.`,
      recommendation: 'Try to have your last meal at least 3 hours before bedtime for better digestion.'
    });
  }

  // Meal consistency
  const avgMeals = weeklyAnalysis.summary.averageMealsPerDay;
  if (avgMeals < 2.5) {
    insights.push({
      type: 'info',
      category: 'consistency',
      message: `You're averaging ${avgMeals} meals per day.`,
      recommendation: 'Try to maintain 3 regular meals for better energy levels throughout the day.'
    });
  } else if (avgMeals >= 3) {
    insights.push({
      type: 'positive',
      category: 'consistency',
      message: `Great meal consistency! Averaging ${avgMeals} meals per day.`
    });
  }

  // Calorie variability
  if (patterns.highCalorieDays.length > 2 && patterns.lowCalorieDays.length > 2) {
    insights.push({
      type: 'info',
      category: 'consistency',
      message: 'Your calorie intake varies significantly day-to-day.',
      recommendation: 'Aim for more consistent portion sizes for stable energy levels.'
    });
  }

  return insights;
}

/**
 * Get most consumed foods
 */
export function getMostConsumedFoods(dailyAnalyses, limit = 10) {
  const foodCounts = {};

  for (const day of dailyAnalyses) {
    for (const meal of day.meals || []) {
      for (const item of meal.items || []) {
        const name = item.name.toLowerCase();
        foodCounts[name] = (foodCounts[name] || 0) + 1;
      }
    }
  }

  return Object.entries(foodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

/**
 * Calculate meal timing regularity score (0-100)
 */
export function calculateMealTimingScore(dailyAnalyses) {
  // Group meals by type and calculate average times
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  const typeTimes = { breakfast: [], lunch: [], dinner: [] };

  for (const day of dailyAnalyses) {
    for (const meal of day.meals || []) {
      if (mealTypes.includes(meal.type) && meal.time) {
        const hour = parseTimeToHour(meal.time);
        typeTimes[meal.type].push(hour);
      }
    }
  }

  let totalDeviation = 0;
  let typeCount = 0;

  for (const type of mealTypes) {
    const times = typeTimes[type];
    if (times.length < 2) continue;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const deviation = times.reduce((sum, time) => sum + Math.abs(time - avg), 0) / times.length;
    
    totalDeviation += deviation;
    typeCount++;
  }

  if (typeCount === 0) return 0;

  const avgDeviation = totalDeviation / typeCount;
  // Convert deviation to score (less deviation = higher score)
  // 0 hours deviation = 100 score, 3+ hours = 0 score
  const score = Math.max(0, 100 - (avgDeviation * 33));
  
  return Math.round(score);
}
