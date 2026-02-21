import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { 
  analyzeDailyMeals, 
  analyzeWeeklyMeals, 
  detectPatterns, 
  generateInsights,
  getMostConsumedFoods,
  calculateMealTimingScore
} from '@/lib/analytics';
import { startOfWeek, endOfWeek, subDays, format } from 'date-fns';

function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type') || 'daily'; // daily, weekly, summary

    const client = await clientPromise;
    const db = client.db('mealplan');
    const processedMeals = db.collection('processedMeals');

    // Get user's processed meals
    const userMeals = await processedMeals.findOne({ userId: user.userId });
    
    if (!userMeals || !userMeals.meals || userMeals.meals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No processed meals found. Please process your meals first.',
        data: null
      });
    }

    // Single day analysis
    if (type === 'daily' && date) {
      const dayMeals = userMeals.meals.filter(m => m.date === date);
      const analysis = await analyzeDailyMeals(dayMeals);

      return NextResponse.json({
        success: true,
        type: 'daily',
        date,
        data: analysis
      });
    }

    // Date range analysis
    if (type === 'weekly' && startDate && endDate) {
      const weeklyAnalysis = await analyzeWeeklyMeals(userMeals.meals, startDate, endDate);
      const patterns = detectPatterns(weeklyAnalysis.days);
      const insights = generateInsights(weeklyAnalysis, patterns);
      const mostConsumed = getMostConsumedFoods(weeklyAnalysis.days);
      const timingScore = calculateMealTimingScore(weeklyAnalysis.days);

      return NextResponse.json({
        success: true,
        type: 'weekly',
        data: {
          ...weeklyAnalysis,
          patterns,
          insights,
          mostConsumedFoods: mostConsumed,
          mealTimingScore: timingScore
        }
      });
    }

    // Overall summary (last 30 days)
    if (type === 'summary') {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      
      const summaryAnalysis = await analyzeWeeklyMeals(
        userMeals.meals,
        format(thirtyDaysAgo, 'yyyy-MM-dd'),
        format(today, 'yyyy-MM-dd')
      );
      
      const patterns = detectPatterns(summaryAnalysis.days);
      const insights = generateInsights(summaryAnalysis, patterns);
      const mostConsumed = getMostConsumedFoods(summaryAnalysis.days, 15);
      const timingScore = calculateMealTimingScore(summaryAnalysis.days);

      return NextResponse.json({
        success: true,
        type: 'summary',
        data: {
          period: '30 days',
          summary: summaryAnalysis.summary,
          patterns,
          insights,
          mostConsumedFoods: mostConsumed,
          mealTimingScore: timingScore,
          totalDaysLogged: summaryAnalysis.days.filter(d => d.mealCount > 0).length
        }
      });
    }

    // Default: today's analysis
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayMeals = userMeals.meals.filter(m => m.date === todayStr);
    const todayAnalysis = await analyzeDailyMeals(todayMeals);

    return NextResponse.json({
      success: true,
      type: 'daily',
      date: todayStr,
      data: todayAnalysis
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics', details: error.message },
      { status: 500 }
    );
  }
}
