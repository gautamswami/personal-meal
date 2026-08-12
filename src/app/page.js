'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthScreen from '@/components/journey/AuthScreen';
import BottomNav from '@/components/journey/BottomNav';
import DatePickerModal from '@/components/journey/DatePickerModal';
import FoodIntakeCard from '@/components/journey/FoodIntakeCard';
import HabitCard from '@/components/journey/HabitCard';
import MealAddModal from '@/components/journey/MealAddModal';
import NotesModal from '@/components/journey/NotesModal';
import StartJourney from '@/components/journey/StartJourney';
import TimeCard from '@/components/journey/TimeCard';
import {
  CHECKLIST_TOTAL,
  dayChecklistCount,
  dayPercent,
  EMPTY_HABITS,
  formatDateLocal,
  formatDisplayDate,
  HABIT_META,
  journeyCycleInfo,
  journeyDayNumber,
  NOTE_HABITS,
} from '@/lib/journey';

const HABIT_ROW1 = [
  { key: 'meditate', label: 'Meditate' },
  { key: 'walk', label: 'Walk' },
  { key: 'read', label: 'Read' },
];
const HABIT_ROW2 = [
  { key: 'work', label: 'Work' },
  { key: 'learn', label: 'Learn' },
  { key: 'travel', label: 'Travel' },
];

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function emptyDay(date) {
  return {
    date,
    habits: { ...EMPTY_HABITS },
    meals: [],
    wakeTime: null,
    sleepTime: null,
  };
}

function normalizeDay(data, fallbackDate) {
  return {
    date: data?.date || fallbackDate,
    habits: { ...EMPTY_HABITS, ...(data?.habits || {}) },
    meals: data?.meals || [],
    wakeTime: data?.wakeTime ?? null,
    sleepTime: data?.sleepTime ?? null,
  };
}

export default function TodayPage() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [bootstrapping, setBootstrapping] = useState(true);
  const [journey, setJourney] = useState(null);
  const [day, setDay] = useState(null);
  const [dayLoading, setDayLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [notesHabit, setNotesHabit] = useState(null);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const todayStr = useMemo(() => formatDateLocal(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const loadDay = useCallback(async (authToken, date) => {
    setDayLoading(true);
    try {
      const dRes = await fetch(`/api/days/${date}`, {
        headers: authHeaders(authToken),
      });
      const dData = await dRes.json();
      if (dRes.ok) {
        setDay(normalizeDay(dData.day, date));
      } else {
        setDay(emptyDay(date));
      }
    } catch {
      setDay(emptyDay(date));
    } finally {
      setDayLoading(false);
    }
  }, []);

  const loadJourneyAndDay = useCallback(
    async (authToken, date = todayStr) => {
      const jRes = await fetch('/api/journey', {
        headers: authHeaders(authToken),
      });
      const jData = await jRes.json();
      if (jRes.ok) setJourney(jData.journey);
      await loadDay(authToken, date);
    },
    [loadDay, todayStr]
  );

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('username');
    if (t) {
      setToken(t);
      setUsername(u || '');
      loadJourneyAndDay(t, selectedDate).finally(() => setBootstrapping(false));
    } else {
      setBootstrapping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap once on mount
  }, []);

  const selectDate = async (date) => {
    setDatePickerOpen(false);
    if (date === selectedDate) return;
    setSelectedDate(date);
    setNotesHabit(null);
    if (token) await loadDay(token, date);
  };

  const patchDay = async (patch) => {
    if (!token || !day) return;
    const date = selectedDate;
    const prev = day;
    const next = {
      ...day,
      ...patch,
      habits: patch.habits ? { ...day.habits, ...patch.habits } : day.habits,
    };
    setDay(next);
    try {
      const res = await fetch(`/api/days/${date}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok) {
        setDay(normalizeDay(data.day, date));
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
          ...(NOTE_HABITS.includes(key)
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
    const res = await fetch(`/api/days/${selectedDate}/meals`, {
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
    const res = await fetch(
      `/api/days/${selectedDate}/meals?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: authHeaders(token),
      }
    );
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
      if (res.ok) {
        setJourney(data.journey);
        setSelectedDate(todayStr);
        await loadDay(token, todayStr);
      }
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
    setSelectedDate(todayStr);
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
          setSelectedDate(todayStr);
          loadJourneyAndDay(t, todayStr).finally(() => setBootstrapping(false));
        }}
      />
    );
  }

  const dayNum = journey ? journeyDayNumber(journey.startDate, selectedDate) : null;
  const cycleInfo = journey ? journeyCycleInfo(journey.startDate, selectedDate) : null;
  const doneCount = dayChecklistCount(day);
  const percent = dayPercent(day);
  const canLog = journey && dayNum !== null;
  const isToday = selectedDate === todayStr;
  const minDate = journey?.startDate || todayStr;

  return (
    <div className="journey-shell pb-20">
      <div className="max-w-md mx-auto px-4 pt-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {canLog ? (
              <p className="text-[11px] tracking-widest text-[#8e8e93] uppercase">
                Day {dayNum}
                {cycleInfo ? ` · Cycle ${cycleInfo.cycle} · ${cycleInfo.dayInCycle}/30` : ''}
                {!isToday ? ' · Past' : ''}
              </p>
            ) : (
              <p className="text-[11px] tracking-widest text-[#8e8e93] uppercase">
                Journey
              </p>
            )}
            {canLog ? (
              <button
                type="button"
                onClick={() => setDatePickerOpen(true)}
                className="group flex items-center gap-1.5 text-left"
                aria-label="Pick a date to edit"
              >
                <h1 className="text-2xl font-bold text-white leading-tight group-hover:text-[#a3e635] transition-colors">
                  {formatDisplayDate(selectedDate)}
                </h1>
                <svg
                  className="w-4 h-4 text-[#8e8e93] group-hover:text-[#a3e635] shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            ) : (
              <h1 className="text-2xl font-bold text-white leading-tight">
                {formatDisplayDate(todayStr)}
              </h1>
            )}
          </div>
          <div className="text-right shrink-0">
            {canLog ? (
              <>
                <p className="text-2xl font-bold text-[#a3e635] leading-none">{percent}%</p>
                <p className="text-xs text-[#8e8e93] mt-1">{doneCount}/{CHECKLIST_TOTAL} done</p>
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

        {canLog && !isToday ? (
          <button
            type="button"
            onClick={() => selectDate(todayStr)}
            className="text-xs text-[#a3e635] font-medium"
          >
            ← Back to today
          </button>
        ) : null}

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
        ) : dayLoading ? (
          <div className="py-16 text-center text-[#8e8e93] text-sm">Loading day…</div>
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

            <div className="grid grid-cols-3 gap-2.5">
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
        title={notesHabit ? HABIT_META[notesHabit]?.label || 'Notes' : 'Notes'}
        initialNotes={notesHabit ? day?.habits?.[notesHabit]?.notes || '' : ''}
        onClose={() => setNotesHabit(null)}
        onSave={saveNotes}
      />

      <MealAddModal
        open={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        onSave={addMeal}
      />

      <DatePickerModal
        open={datePickerOpen}
        value={selectedDate}
        min={minDate}
        max={todayStr}
        onClose={() => setDatePickerOpen(false)}
        onSelect={selectDate}
      />
    </div>
  );
}
