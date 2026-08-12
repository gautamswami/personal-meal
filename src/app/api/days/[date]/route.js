import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { EMPTY_HABITS, emptyDayDoc, HABIT_KEYS, NOTE_HABITS } from '@/lib/journey';

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

export async function GET(_request, { params }) {
  try {
    const user = verifyToken(_request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = await params;
    if (!isValidDate(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const col = await daysCollection();
    const userId = String(user.userId);
    let day = await col.findOne({ userId, date });

    if (!day) {
      day = emptyDayDoc(userId, date);
    }

    return NextResponse.json({
      success: true,
      day: {
        date: day.date,
        habits: day.habits || EMPTY_HABITS,
        meals: day.meals || [],
        wakeTime: day.wakeTime ?? null,
        sleepTime: day.sleepTime ?? null,
      },
    });
  } catch (error) {
    console.error('Get day error:', error);
    return NextResponse.json({ error: 'Failed to fetch day' }, { status: 500 });
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

    const body = await request.json();
    const userId = String(user.userId);
    const col = await daysCollection();

    const existing = await col.findOne({ userId, date });
    const base = existing || emptyDayDoc(userId, date);
    const habits = { ...EMPTY_HABITS, ...(base.habits || {}) };

    if (body.habits && typeof body.habits === 'object') {
      for (const key of HABIT_KEYS) {
        if (body.habits[key] === undefined) continue;
        const patch = body.habits[key];
        habits[key] = {
          ...habits[key],
          ...(typeof patch.done === 'boolean' ? { done: patch.done } : {}),
          ...(NOTE_HABITS.includes(key)
            ? { notes: patch.notes !== undefined ? String(patch.notes) : habits[key].notes || '' }
            : {}),
        };
        if (NOTE_HABITS.includes(key)) {
          habits[key].notes = habits[key].notes || '';
        }
      }
    }

    const update = {
      userId,
      date,
      habits,
      meals: base.meals || [],
      wakeTime:
        body.wakeTime !== undefined
          ? body.wakeTime === null || body.wakeTime === ''
            ? null
            : String(body.wakeTime)
          : base.wakeTime ?? null,
      sleepTime:
        body.sleepTime !== undefined
          ? body.sleepTime === null || body.sleepTime === ''
            ? null
            : String(body.sleepTime)
          : base.sleepTime ?? null,
      updatedAt: new Date(),
    };

    await col.updateOne(
      { userId, date },
      {
        $set: update,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      day: {
        date: update.date,
        habits: update.habits,
        meals: update.meals,
        wakeTime: update.wakeTime,
        sleepTime: update.sleepTime,
      },
    });
  } catch (error) {
    console.error('Patch day error:', error);
    return NextResponse.json({ error: 'Failed to update day' }, { status: 500 });
  }
}
