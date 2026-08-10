import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { formatDateLocal } from '@/lib/journey';

async function getDb() {
  const client = await clientPromise;
  return client.db('mealplan');
}

function serializeJourney(journey) {
  if (!journey) return null;
  return {
    startDate: journey.startDate,
    status: journey.status,
    createdAt: journey.createdAt,
  };
}

export async function GET(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const journey = await db.collection('journeys').findOne({
      userId: String(user.userId),
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      journey: serializeJourney(journey),
    });
  } catch (error) {
    console.error('Get journey error:', error);
    return NextResponse.json({ error: 'Failed to fetch journey' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const startDate = body.startDate || formatDateLocal(new Date());

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return NextResponse.json({ error: 'Invalid startDate' }, { status: 400 });
    }

    const db = await getDb();
    const journeys = db.collection('journeys');

    const existing = await journeys.findOne({
      userId: String(user.userId),
      status: 'active',
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        journey: serializeJourney(existing),
        alreadyStarted: true,
      });
    }

    const doc = {
      userId: String(user.userId),
      username: user.username,
      startDate,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await journeys.insertOne(doc);

    return NextResponse.json({
      success: true,
      journey: serializeJourney(doc),
    });
  } catch (error) {
    console.error('Start journey error:', error);
    return NextResponse.json({ error: 'Failed to start journey' }, { status: 500 });
  }
}
