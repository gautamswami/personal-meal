import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import {
  CYCLE_DAYS,
  HABIT_KEYS,
  addDays,
  computeAllHabitStreaks,
  dayScore,
  formatDateLocal,
  journeyCycleInfo,
  journeyDayNumber,
  typicalTime,
} from '@/lib/journey';

export async function GET(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('mealplan');
    const userId = String(user.userId);

    const journey = await db.collection('journeys').findOne({
      userId,
      status: 'active',
    });

    if (!journey) {
      return NextResponse.json({
        success: true,
        journey: null,
        stats: null,
      });
    }

    const todayStr = formatDateLocal(new Date());
    const dayNum = journeyDayNumber(journey.startDate, todayStr);
    const cycleInfo = journeyCycleInfo(journey.startDate, todayStr);

    // Load all days from start through today (open-ended)
    const days = await db
      .collection('days')
      .find({
        userId,
        date: { $gte: journey.startDate, $lte: todayStr },
      })
      .toArray();

    const dayMap = {};
    for (const d of days) {
      dayMap[d.date] = d;
    }

    // Habit / food / sleep stats over all elapsed days
    let percentSum = 0;
    let elapsedCount = 0;
    let totalMeals = 0;
    const wakeTimes = [];
    const sleepTimes = [];
    const habitDone = Object.fromEntries(HABIT_KEYS.map((k) => [k, 0]));

    if (dayNum !== null) {
      for (let i = 0; i < dayNum; i++) {
        const date = addDays(journey.startDate, i);
        const day = dayMap[date];
        const score = dayScore(day);
        const percent = Math.round(score * 100);
        elapsedCount += 1;
        percentSum += percent;
        if (day) {
          totalMeals += day.meals?.length || 0;
          if (day.wakeTime) wakeTimes.push(day.wakeTime);
          if (day.sleepTime) sleepTimes.push(day.sleepTime);
          for (const key of HABIT_KEYS) {
            if (day.habits?.[key]?.done) habitDone[key] += 1;
          }
        }
      }
    }

    // Heatmap: current 30-day cycle window only
    const heatmap = [];
    const windowStart = cycleInfo?.windowStart || journey.startDate;
    for (let i = 0; i < CYCLE_DAYS; i++) {
      const date = addDays(windowStart, i);
      const absoluteDay = journeyDayNumber(journey.startDate, date);
      const day = dayMap[date];
      const score = date <= todayStr ? dayScore(day) : 0;
      const percent = Math.round(score * 100);
      heatmap.push({
        date,
        day: absoluteDay,
        dayInCycle: i + 1,
        score: date <= todayStr ? score : 0,
        percent: date <= todayStr ? percent : 0,
        future: date > todayStr,
      });
    }

    const denom = Math.max(elapsedCount, 1);
    const habitStats = Object.fromEntries(
      HABIT_KEYS.map((key) => {
        const done = habitDone[key];
        return [
          key,
          {
            done,
            total: denom,
            percent: Math.round((done / denom) * 100),
          },
        ];
      })
    );

    const habitStreaks = computeAllHabitStreaks(
      dayMap,
      journey.startDate,
      todayStr
    );
    const average = Math.round(percentSum / denom);

    return NextResponse.json({
      success: true,
      journey: {
        startDate: journey.startDate,
        status: journey.status,
      },
      stats: {
        average,
        habitStreaks,
        heatmap,
        cycle: cycleInfo
          ? {
              cycle: cycleInfo.cycle,
              dayInCycle: cycleInfo.dayInCycle,
              dayNum: cycleInfo.dayNum,
            }
          : null,
        habitStats,
        food: {
          totalMeals,
          avgMealsPerDay: Math.round((totalMeals / denom) * 10) / 10,
        },
        sleep: {
          typicalWake: typicalTime(wakeTimes),
          typicalSleep: typicalTime(sleepTimes),
        },
        elapsedDays: elapsedCount,
      },
    });
  } catch (error) {
    console.error('Journey stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
