export const HABIT_KEYS = ['meditate', 'walk', 'read', 'work', 'learn', 'travel'];

export const NOTE_HABITS = ['work', 'learn', 'travel'];

export const HABIT_META = {
  meditate: { label: 'Meditate', color: '#a855f7' },
  walk: { label: 'Walk', color: '#22c55e' },
  read: { label: 'Read', color: '#3b82f6' },
  work: { label: 'Work', color: '#f97316' },
  learn: { label: 'Learn', color: '#eab308' },
  travel: { label: 'Travel', color: '#06b6d4' },
};

export const EMPTY_HABITS = {
  meditate: { done: false },
  walk: { done: false },
  read: { done: false },
  work: { done: false, notes: '' },
  learn: { done: false, notes: '' },
  travel: { done: false, notes: '' },
};

/** Habits + wake + sleep */
export const CHECKLIST_TOTAL = HABIT_KEYS.length + 2;

/** Day counts as “complete” for overall metrics when this fraction is done */
export const STREAK_THRESHOLD = 6 / CHECKLIST_TOTAL;
/** Rolling/cycle window size for heatmap and similar UI */
export const CYCLE_DAYS = 30;

/** Format Date as YYYY-MM-DD in local timezone */
export function formatDateLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD as local midnight Date */
export function parseDateLocal(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateStr, days) {
  const d = parseDateLocal(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateLocal(d);
}

export function daysBetween(startStr, endStr) {
  const start = parseDateLocal(startStr);
  const end = parseDateLocal(endStr);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

/**
 * Absolute day number since journey start (1, 2, 3, … open-ended).
 * null if date is before start.
 */
export function journeyDayNumber(startDate, dateStr) {
  const n = daysBetween(startDate, dateStr) + 1;
  if (n < 1) return null;
  return n;
}

/** Position within the repeating 30-day display cycle */
export function journeyCycleInfo(startDate, dateStr) {
  const dayNum = journeyDayNumber(startDate, dateStr);
  if (dayNum === null) return null;
  const cycle = Math.floor((dayNum - 1) / CYCLE_DAYS) + 1;
  const dayInCycle = ((dayNum - 1) % CYCLE_DAYS) + 1;
  const windowStart = addDays(startDate, (cycle - 1) * CYCLE_DAYS);
  return { dayNum, cycle, dayInCycle, windowStart };
}

export function emptyDayDoc(userId, date) {
  return {
    userId,
    date,
    habits: structuredClone
      ? structuredClone(EMPTY_HABITS)
      : JSON.parse(JSON.stringify(EMPTY_HABITS)),
    meals: [],
    wakeTime: null,
    sleepTime: null,
    updatedAt: new Date(),
  };
}

export function dayChecklistCount(day) {
  if (!day) return 0;
  let count = 0;
  for (const key of HABIT_KEYS) {
    if (day.habits?.[key]?.done) count += 1;
  }
  if (day.wakeTime) count += 1;
  if (day.sleepTime) count += 1;
  return count;
}

export function dayScore(day) {
  return dayChecklistCount(day) / CHECKLIST_TOTAL;
}

export function dayPercent(day) {
  return Math.round(dayScore(day) * 100);
}

export function isDayComplete(day) {
  return dayScore(day) >= STREAK_THRESHOLD;
}

export function isHabitDone(day, habitKey) {
  return !!day?.habits?.[habitKey]?.done;
}

/**
 * Current streak: consecutive completed days ending at today or yesterday
 * (today incomplete does not break if yesterday completed).
 */
export function computeStreak(dayMap, startDate, todayStr) {
  let cursor = todayStr;
  if (cursor < startDate) return 0;

  // If today is not complete, start from yesterday
  if (!isDayComplete(dayMap[cursor])) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (cursor >= startDate) {
    if (!isDayComplete(dayMap[cursor])) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function computeBestStreak(dayMap, startDate, todayStr) {
  if (todayStr < startDate) return 0;
  let best = 0;
  let current = 0;
  let cursor = startDate;
  while (cursor <= todayStr) {
    if (isDayComplete(dayMap[cursor])) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

/** Current consecutive days a single habit was marked done */
export function computeHabitStreak(dayMap, startDate, todayStr, habitKey) {
  let cursor = todayStr;
  if (cursor < startDate) return 0;

  if (!isHabitDone(dayMap[cursor], habitKey)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (cursor >= startDate) {
    if (!isHabitDone(dayMap[cursor], habitKey)) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function computeHabitBestStreak(dayMap, startDate, todayStr, habitKey) {
  if (todayStr < startDate) return 0;
  let best = 0;
  let current = 0;
  let cursor = startDate;
  while (cursor <= todayStr) {
    if (isHabitDone(dayMap[cursor], habitKey)) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

export function computeAllHabitStreaks(dayMap, startDate, todayStr) {
  return Object.fromEntries(
    HABIT_KEYS.map((key) => [
      key,
      {
        current: computeHabitStreak(dayMap, startDate, todayStr, key),
        best: computeHabitBestStreak(dayMap, startDate, todayStr, key),
      },
    ])
  );
}

export function formatDisplayDate(dateStr) {
  const d = parseDateLocal(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Median of non-null time strings (kept as-is for display "typical") — use most common or first non-empty average-ish: pick median by minutes */
export function typicalTime(times) {
  const valid = times.filter(Boolean);
  if (valid.length === 0) return null;
  const toMinutes = (t) => {
    const match = String(t).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ap = match[3].toUpperCase();
    if (ap === 'PM' && h !== 12) h += 12;
    if (ap === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };
  const fromMinutes = (mins) => {
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2, '0')} ${ap}`;
  };
  const minutes = valid.map(toMinutes).filter((n) => n !== null).sort((a, b) => a - b);
  if (minutes.length === 0) return valid[0];
  const mid = Math.floor(minutes.length / 2);
  const median =
    minutes.length % 2 === 0
      ? Math.round((minutes[mid - 1] + minutes[mid]) / 2)
      : minutes[mid];
  return fromMinutes(median);
}
