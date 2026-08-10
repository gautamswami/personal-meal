import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

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
    const meals = db.collection('meals');

    const userMeals = await meals.findOne({ userId: user.userId });

    return NextResponse.json({
      success: true,
      meals: userMeals?.meals || [],
    });
  } catch (error) {
    console.error('Get meals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
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

    const { meals } = await request.json();

    const client = await clientPromise;
    const db = client.db('mealplan');
    const mealsCollection = db.collection('meals');

    await mealsCollection.updateOne(
      { userId: user.userId },
      {
        $set: {
          meals,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: user.userId,
          username: user.username,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Meals saved successfully',
    });
  } catch (error) {
    console.error('Save meals error:', error);
    return NextResponse.json(
      { error: 'Failed to save meals' },
      { status: 500 }
    );
  }
}
