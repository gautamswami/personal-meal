'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AuthScreen from '@/components/journey/AuthScreen';
import BottomNav from '@/components/journey/BottomNav';
import ExerciseCard from '@/components/gym/ExerciseCard';
import {
  GYM_PROFILE,
  WEEKDAY_FULL,
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  emptyGymState,
  getDayPlan,
  isGymDayComplete,
  weekdayFromDate,
} from '@/lib/gymPlan';
import { EMPTY_HABITS, formatDateLocal } from '@/lib/journey';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function normalizeDay(data, fallbackDate) {
  return {
    date: data?.date || fallbackDate,
    habits: { ...EMPTY_HABITS, ...(data?.habits || {}) },
    gym: {
      exercises: { ...(data?.gym?.exercises || {}) },
    },
    meals: data?.meals || [],
    wakeTime: data?.wakeTime ?? null,
    sleepTime: data?.sleepTime ?? null,
  };
}

export default function GymPage() {
  const [token, setToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [day, setDay] = useState(null);
  const [dayLoading, setDayLoading] = useState(false);
  const [gymStreak, setGymStreak] = useState({ current: 0, best: 0 });

  const todayStr = useMemo(() => formatDateLocal(new Date()), []);
  const todayWeekday = useMemo(() => weekdayFromDate(todayStr), [todayStr]);
  const [selectedWeekday, setSelectedWeekday] = useState(todayWeekday);

  const plan = useMemo(() => getDayPlan(selectedWeekday), [selectedWeekday]);
  const viewingToday = selectedWeekday === todayWeekday;

  const loadDay = useCallback(
    async (authToken) => {
      setDayLoading(true);
      try {
        const res = await fetch(`/api/days/${todayStr}`, {
          headers: authHeaders(authToken),
        });
        const data = await res.json();
        if (res.ok) {
          setDay(normalizeDay(data.day, todayStr));
        } else {
          setDay(normalizeDay({ date: todayStr, gym: emptyGymState() }, todayStr));
        }
      } catch {
        setDay(normalizeDay({ date: todayStr, gym: emptyGymState() }, todayStr));
      } finally {
        setDayLoading(false);
      }
    },
    [todayStr]
  );

  const loadStreak = useCallback(async (authToken) => {
    try {
      const res = await fetch('/api/journey/stats', { headers: authHeaders(authToken) });
      const data = await res.json();
      if (res.ok && data.stats?.habitStreaks?.gym) {
        setGymStreak(data.stats.habitStreaks.gym);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      Promise.all([loadDay(t), loadStreak(t)]).finally(() => setBootstrapping(false));
    } else {
      setBootstrapping(false);
    }
  }, [loadDay, loadStreak]);

  const patchGym = async (exerciseId, done) => {
    if (!token || !day || !viewingToday) return;
    const prev = day;
    const exercises = { ...day.gym.exercises, [exerciseId]: done };
    const gymComplete = isGymDayComplete(todayWeekday, { exercises });
    const next = {
      ...day,
      gym: { exercises },
      habits: {
        ...day.habits,
        gym: { done: gymComplete },
      },
    };
    setDay(next);

    try {
      const res = await fetch(`/api/days/${todayStr}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({
          gym: { exercises },
          habits: { gym: { done: gymComplete } },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDay(normalizeDay(data.day, todayStr));
        loadStreak(token);
      } else {
        setDay(prev);
      }
    } catch {
      setDay(prev);
    }
  };

  const markAllDone = async () => {
    if (!token || !day || !viewingToday || !plan) return;
    const exercises = Object.fromEntries(plan.exerciseIds.map((id) => [id, true]));
    const prev = day;
    setDay({
      ...day,
      gym: { exercises },
      habits: { ...day.habits, gym: { done: true } },
    });
    try {
      const res = await fetch(`/api/days/${todayStr}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({
          gym: { exercises },
          habits: { gym: { done: true } },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDay(normalizeDay(data.day, todayStr));
        loadStreak(token);
      } else {
        setDay(prev);
      }
    } catch {
      setDay(prev);
    }
  };

  if (bootstrapping) {
    return (
      <div className="journey-shell flex items-center justify-center min-h-dvh text-[#8e8e93]">
        Loading…
      </div>
    );
  }

  if (!token) {
    return (
      <AuthScreen
        onAuthenticated={({ token: t }) => {
          setToken(t);
          setBootstrapping(true);
          Promise.all([loadDay(t), loadStreak(t)]).finally(() => setBootstrapping(false));
        }}
      />
    );
  }

  const doneMap = viewingToday ? day?.gym?.exercises || {} : {};
  const doneCount = plan
    ? plan.exerciseIds.filter((id) => !!doneMap[id]).length
    : 0;
  const allDone = plan && doneCount === plan.exerciseIds.length;

  return (
    <div className="journey-shell pb-20">
      <div className="max-w-md mx-auto px-4 pt-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-widest text-[#8e8e93] uppercase">Train</p>
            <h1 className="text-3xl font-bold text-white">Gym</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#a3e635] leading-none tabular-nums">
              {gymStreak.current}
              <span className="text-sm font-medium text-[#8e8e93] ml-0.5">d</span>
            </p>
            <p className="text-[11px] text-[#8e8e93] mt-1">streak · best {gymStreak.best}</p>
          </div>
        </div>

        <div className="journey-card p-3.5 space-y-1.5">
          <p className="text-sm font-semibold text-white">
            {GYM_PROFILE.startWeightKg} → {GYM_PROFILE.targetWeightKg} kg
            <span className="text-[#8e8e93] font-normal"> · {GYM_PROFILE.weeks} weeks</span>
          </p>
          <p className="text-xs text-[#aeaeb2] leading-relaxed">
            5&apos;8&quot; · {GYM_PROFILE.sessionMinutes} sessions · {GYM_PROFILE.proteinHint}. Aim{' '}
            {GYM_PROFILE.deficitHint} alongside this plan.
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-0.5 px-0.5 scrollbar-none">
          {WEEKDAY_KEYS.map((key) => {
            const active = key === selectedWeekday;
            const isToday = key === todayWeekday;
            const dayPlan = getDayPlan(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedWeekday(key)}
                className={`shrink-0 min-w-[44px] px-2.5 py-2 rounded-xl text-center transition-colors ${
                  active
                    ? 'bg-[#a3e635] text-black'
                    : 'bg-[#1c1c1e] border border-[#2c2c2e] text-[#aeaeb2]'
                }`}
              >
                <span className="block text-[11px] font-semibold leading-none">
                  {WEEKDAY_LABELS[key]}
                </span>
                <span
                  className={`block text-[9px] mt-1 leading-none ${
                    active ? 'text-black/60' : 'text-[#636366]'
                  }`}
                >
                  {dayPlan?.focusShort || dayPlan?.focus}
                </span>
                {isToday && !active ? (
                  <span className="block w-1 h-1 rounded-full bg-[#a3e635] mx-auto mt-1" />
                ) : (
                  <span className="block h-1 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {plan ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-[#8e8e93]">
                  {WEEKDAY_FULL[selectedWeekday]}
                  {viewingToday ? ' · Today' : ' · Preview'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(plan.muscles || []).map((m, i) => (
                    <span key={m} className="inline-flex items-center gap-1.5">
                      {i > 0 ? (
                        <span className="text-[#636366] text-sm font-medium">+</span>
                      ) : null}
                      <span
                        className="text-sm font-bold px-2.5 py-1 rounded-lg text-black"
                        style={{ backgroundColor: plan.color }}
                      >
                        {m}
                      </span>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#8e8e93]">
                  {plan.subtitle} · {plan.exerciseIds.length} exercises · ~{plan.durationMin} min
                </p>
              </div>
              {viewingToday ? (
                <button
                  type="button"
                  onClick={markAllDone}
                  disabled={allDone || dayLoading}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-lg shrink-0 mt-5 ${
                    allDone
                      ? 'text-[#a3e635] bg-[#a3e635]/10'
                      : 'text-black bg-[#a3e635] disabled:opacity-40'
                  }`}
                >
                  {allDone ? 'Session done' : 'Finish all'}
                </button>
              ) : (
                <Link href="/" className="text-xs text-[#8e8e93] shrink-0 mt-5">
                  Log on that day →
                </Link>
              )}
            </div>

            <p className="text-[11px] text-[#636366]">Warm-up: {plan.warmup}</p>

            {viewingToday && !dayLoading ? (
              <div className="h-1 rounded-full bg-[#2c2c2e] overflow-hidden">
                <div
                  className="h-full bg-[#a3e635] transition-all duration-300"
                  style={{
                    width: `${plan.exerciseIds.length ? (doneCount / plan.exerciseIds.length) * 100 : 0}%`,
                  }}
                />
              </div>
            ) : null}

            {dayLoading && viewingToday ? (
              <div className="py-10 text-center text-sm text-[#8e8e93]">Loading…</div>
            ) : (
              plan.exercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  done={viewingToday ? !!doneMap[ex.id] : false}
                  onToggle={() => {
                    if (!viewingToday) {
                      setSelectedWeekday(todayWeekday);
                      return;
                    }
                    patchGym(ex.id, !doneMap[ex.id]);
                  }}
                />
              ))
            )}

            {!viewingToday ? (
              <p className="text-xs text-center text-[#636366] pb-2">
                Switch to today to mark exercises done. Other days are the weekly template.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <BottomNav />
    </div>
  );
}
