'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthScreen from '@/components/journey/AuthScreen';
import BottomNav from '@/components/journey/BottomNav';
import FoodIntakeCard from '@/components/journey/FoodIntakeCard';
import HabitCard from '@/components/journey/HabitCard';
import MealAddModal from '@/components/journey/MealAddModal';
import NotesModal from '@/components/journey/NotesModal';
import StartJourney from '@/components/journey/StartJourney';
import TimeCard from '@/components/journey/TimeCard';
import {
  dayChecklistCount,
  dayPercent,
  EMPTY_HABITS,
  formatDateLocal,
  formatDisplayDate,
  journeyCycleInfo,
  journeyDayNumber,
} from '@/lib/journey';

const HABIT_ROW1 = [
  { key: 'meditate', label: 'Meditate' },
  { key: 'walk', label: 'Walk' },
  { key: 'read', label: 'Read' },
];
const HABIT_ROW2 = [
  { key: 'work', label: 'Work' },
  { key: 'learn', label: 'Learn' },
];

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export default function TodayPage() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [bootstrapping, setBootstrapping] = useState(true);
  const [journey, setJourney] = useState(null);
  const [day, setDay] = useState(null);
  const [starting, setStarting] = useState(false);
  const [notesHabit, setNotesHabit] = useState(null);
  const [mealModalOpen, setMealModalOpen] = useState(false);

  const todayStr = useMemo(() => formatDateLocal(new Date()), []);

  const loadJourneyAndDay = useCallback(async (authToken) => {
    const [jRes, dRes] = await Promise.all([
      fetch('/api/journey', { headers: authHeaders(authToken) }),
      fetch(`/api/days/${todayStr}`, { headers: authHeaders(authToken) }),
    ]);
    const jData = await jRes.json();
    const dData = await dRes.json();
    if (jRes.ok) setJourney(jData.journey);
    if (dRes.ok) {
      setDay({
        date: dData.day.date,
        habits: { ...EMPTY_HABITS, ...dData.day.habits },
        meals: dData.day.meals || [],
        wakeTime: dData.day.wakeTime,
        sleepTime: dData.day.sleepTime,
      });
    } else {
      setDay({
        date: todayStr,
        habits: { ...EMPTY_HABITS },
        meals: [],
        wakeTime: null,
        sleepTime: null,
      });
    }
  }, [todayStr]);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('username');
    if (t) {
      setToken(t);
      setUsername(u || '');
      loadJourneyAndDay(t).finally(() => setBootstrapping(false));
    } else {
      setBootstrapping(false);
    }
  }, [loadJourneyAndDay]);

  const patchDay = async (patch) => {
    if (!token || !day) return;
    const prev = day;
    const next = {
      ...day,
      ...patch,
      habits: patch.habits ? { ...day.habits, ...patch.habits } : day.habits,
    };
    setDay(next);
    try {
      const res = await fetch(`/api/days/${todayStr}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok) {
        setDay({
          date: data.day.date,
          habits: { ...EMPTY_HABITS, ...data.day.habits },
          meals: data.day.meals || [],
          wakeTime: data.day.wakeTime,
          sleepTime: data.day.sleepTime,
        });
      } else {
        setDay(prev);
      }
    } catch {
      setDay(prev);
    }
  };

  const toggleHabit = (key) => {
    const current = day?.habits?.[key]?.done;
    patchDay({
      habits: {
        [key]: {
          done: !current,
          ...(key === 'work' || key === 'learn'
            ? { notes: day?.habits?.[key]?.notes || '' }
            : {}),
        },
      },
    });
  };

  const saveNotes = async (notes) => {
    if (!notesHabit) return;
    await patchDay({
      habits: {
        [notesHabit]: {
          done: !!day?.habits?.[notesHabit]?.done,
          notes,
        },
      },
    });
    setNotesHabit(null);
  };

  const addMeal = async ({ text, time }) => {
    if (!token) return;
    const res = await fetch(`/api/days/${todayStr}/meals`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ text, time }),
    });
    const data = await res.json();
    if (res.ok) {
      setDay((d) => ({ ...d, meals: data.meals }));
      setMealModalOpen(false);
    }
  };

  const deleteMeal = async (id) => {
    if (!token) return;
    const res = await fetch(`/api/days/${todayStr}/meals?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (res.ok) setDay((d) => ({ ...d, meals: data.meals }));
  };

  const startJourney = async () => {
    setStarting(true);
    try {
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ startDate: todayStr }),
      });
      const data = await res.json();
      if (res.ok) setJourney(data.journey);
    } finally {
      setStarting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername('');
    setJourney(null);
    setDay(null);
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
        onAuthenticated={({ token: t, username: u }) => {
          setToken(t);
          setUsername(u);
          setBootstrapping(true);
          loadJourneyAndDay(t).finally(() => setBootstrapping(false));
        }}
      />
    );
  }

  const dayNum = journey ? journeyDayNumber(journey.startDate, todayStr) : null;
  const cycleInfo = journey ? journeyCycleInfo(journey.startDate, todayStr) : null;
  const doneCount = dayChecklistCount(day);
  const percent = dayPercent(day);
  const canLog = journey && dayNum !== null;

  return (
    <div className="journey-shell pb-20">
      <div className="max-w-md mx-auto px-4 pt-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            {canLog ? (
              <p className="text-[11px] tracking-widest text-[#8e8e93] uppercase">
                Day {dayNum}
                {cycleInfo ? ` · Cycle ${cycleInfo.cycle} · ${cycleInfo.dayInCycle}/30` : ''}
              </p>
            ) : (
              <p className="text-[11px] tracking-widest text-[#8e8e93] uppercase">
                Journey
              </p>
            )}
            <h1 className="text-2xl font-bold text-white leading-tight">
              {formatDisplayDate(todayStr)}
            </h1>
          </div>
          <div className="text-right">
            {canLog ? (
              <>
                <p className="text-2xl font-bold text-[#a3e635] leading-none">{percent}%</p>
                <p className="text-xs text-[#8e8e93] mt-1">{doneCount}/7 done</p>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-[#8e8e93] hover:text-white"
              >
                {username || 'Logout'}
              </button>
            )}
          </div>
        </div>

        {canLog ? (
          <div className="h-1 rounded-full bg-[#2c2c2e] overflow-hidden">
            <div
              className="h-full bg-[#a3e635] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : null}

        {!journey ? (
          <StartJourney onStart={startJourney} loading={starting} />
        ) : !canLog ? (
          <div className="journey-card p-6 text-center space-y-2">
            <p className="text-white font-medium">Journey starts {journey.startDate}</p>
            <p className="text-sm text-[#8e8e93]">Come back on that day to begin logging.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              {HABIT_ROW1.map((h) => (
                <HabitCard
                  key={h.key}
                  habitKey={h.key}
                  label={h.label}
                  done={!!day?.habits?.[h.key]?.done}
                  onToggle={() => toggleHabit(h.key)}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {HABIT_ROW2.map((h) => (
                <HabitCard
                  key={h.key}
                  habitKey={h.key}
                  label={h.label}
                  done={!!day?.habits?.[h.key]?.done}
                  onToggle={() => toggleHabit(h.key)}
                  showNotes
                  hasNotes={!!day?.habits?.[h.key]?.notes}
                  onNotes={() => setNotesHabit(h.key)}
                  wide
                />
              ))}
            </div>

            <FoodIntakeCard
              meals={day?.meals || []}
              onAdd={() => setMealModalOpen(true)}
              onDelete={deleteMeal}
            />

            <div className="grid grid-cols-2 gap-2.5">
              <TimeCard
                label="Wake up"
                value={day?.wakeTime}
                onChange={(v) => patchDay({ wakeTime: v })}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                }
              />
              <TimeCard
                label="Sleep"
                value={day?.sleepTime}
                onChange={(v) => patchDay({ sleepTime: v })}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    />
                  </svg>
                }
              />
            </div>

            <div className="pt-1 pb-2 flex justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-[#636366] hover:text-[#8e8e93]"
              >
                Log out ({username})
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />

      <NotesModal
        open={!!notesHabit}
        title={notesHabit === 'work' ? 'Work' : 'Learn'}
        initialNotes={notesHabit ? day?.habits?.[notesHabit]?.notes || '' : ''}
        onClose={() => setNotesHabit(null)}
        onSave={saveNotes}
      />

      <MealAddModal
        open={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        onSave={addMeal}
      />
    </div>
  );
}
