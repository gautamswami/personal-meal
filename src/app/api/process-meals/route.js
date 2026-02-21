import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { parseMealText, batchParseMeals } from '@/lib/foodRecognition';

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

export async function POST(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { meals, mode = 'batch' } = body; // meals: array of meal objects with {date, type, text}

    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return NextResponse.json(
        { error: 'Meals array is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('mealplan');
    const processedMealsCollection = db.collection('processedMeals');

    // Process meals through OpenAI
    const mealTexts = meals.map(m => m.text || m.food || '');
    const parsedResults = await batchParseMeals(mealTexts);

    // Structure processed data
    const processedMeals = meals.map((meal, index) => ({
      date: meal.date,
      type: meal.type || 'other',
      time: meal.time,
      originalText: mealTexts[index],
      items: parsedResults[index]?.items || [],
      processedAt: new Date()
    }));

    // Save to database
    await processedMealsCollection.updateOne(
      { userId: user.userId },
      {
        $set: {
          meals: processedMeals,
          updatedAt: new Date()
        },
        $setOnInsert: {
          userId: user.userId,
          username: user.username,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${processedMeals.length} meals`,
      processedCount: processedMeals.length
    });

  } catch (error) {
    console.error('Process meals error:', error);
    return NextResponse.json(
      { error: 'Failed to process meals', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check processing status
export async function GET(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('mealplan');
    const processedMeals = db.collection('processedMeals');

    const userProcessedMeals = await processedMeals.findOne({ userId: user.userId });

    if (!userProcessedMeals) {
      return NextResponse.json({
        success: true,
        processed: false,
        count: 0,
        message: 'No processed meals found'
      });
    }

    return NextResponse.json({
      success: true,
      processed: true,
      count: userProcessedMeals.meals?.length || 0,
      lastUpdated: userProcessedMeals.updatedAt
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
