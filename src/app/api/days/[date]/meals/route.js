import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { emptyDayDoc } from '@/lib/journey';
import crypto from 'crypto';

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

async function daysCollection() {
  const client = await clientPromise;
  const db = client.db('mealplan');
  const col = db.collection('days');
  await col.createIndex({ userId: 1, date: 1 }, { unique: true });
  return col;
}

export async function POST(request, { params }) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = await params;
    if (!isValidDate(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const { text, time } = await request.json();
    if (!text || !String(text).trim()) {
      return NextResponse.json({ error: 'Meal text is required' }, { status: 400 });
    }

    const userId = String(user.userId);
    const col = await daysCollection();
    const existing = await col.findOne({ userId, date });
    const meals = existing?.meals ? [...existing.meals] : [];

    const meal = {
      id: crypto.randomUUID(),
      text: String(text).trim(),
      time: time ? String(time) : new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
    meals.push(meal);

    if (!existing) {
      const doc = emptyDayDoc(userId, date);
      doc.meals = meals;
      await col.insertOne({ ...doc, createdAt: new Date() });
    } else {
      await col.updateOne(
        { userId, date },
        { $set: { meals, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true, meal, meals });
  } catch (error) {
    console.error('Add meal error:', error);
    return NextResponse.json({ error: 'Failed to add meal' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = await params;
    if (!isValidDate(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const { id, text, time } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Meal id is required' }, { status: 400 });
    }

    const userId = String(user.userId);
    const col = await daysCollection();
    const existing = await col.findOne({ userId, date });
    if (!existing) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const meals = (existing.meals || []).map((m) => {
      if (m.id !== id) return m;
      return {
        ...m,
        ...(text !== undefined ? { text: String(text).trim() } : {}),
        ...(time !== undefined ? { time: String(time) } : {}),
      };
    });

    await col.updateOne(
      { userId, date },
      { $set: { meals, updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      meal: meals.find((m) => m.id === id),
      meals,
    });
  } catch (error) {
    console.error('Patch meal error:', error);
    return NextResponse.json({ error: 'Failed to update meal' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = await params;
    if (!isValidDate(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Meal id is required' }, { status: 400 });
    }

    const userId = String(user.userId);
    const col = await daysCollection();
    const existing = await col.findOne({ userId, date });
    if (!existing) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const meals = (existing.meals || []).filter((m) => m.id !== id);
    await col.updateOne(
      { userId, date },
      { $set: { meals, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, meals });
  } catch (error) {
    console.error('Delete meal error:', error);
    return NextResponse.json({ error: 'Failed to delete meal' }, { status: 500 });
  }
}
