'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AuthScreen from '@/components/journey/AuthScreen';
import BottomNav from '@/components/journey/BottomNav';
import HabitCompletionList from '@/components/journey/HabitCompletionList';
import HabitStreaks from '@/components/journey/HabitStreaks';
import Heatmap from '@/components/journey/Heatmap';
import StartJourney from '@/components/journey/StartJourney';
import { formatDateLocal } from '@/lib/journey';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export default function ProgressPage() {
  const [token, setToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [journey, setJourney] = useState(null);
  const [stats, setStats] = useState(null);
  const [starting, setStarting] = useState(false);

  const loadStats = useCallback(async (authToken) => {
    const res = await fetch('/api/journey/stats', { headers: authHeaders(authToken) });
    const data = await res.json();
    if (res.ok) {
      setJourney(data.journey);
      setStats(data.stats);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      loadStats(t).finally(() => setBootstrapping(false));
    } else {
      setBootstrapping(false);
    }
  }, [loadStats]);

  const startJourney = async () => {
    setStarting(true);
    try {
      const todayStr = formatDateLocal(new Date());
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ startDate: todayStr }),
      });
      if (res.ok) await loadStats(token);
    } finally {
      setStarting(false);
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
          loadStats(t).finally(() => setBootstrapping(false));
        }}
      />
    );
  }

  return (
    <div className="journey-shell pb-20">
      <div className="max-w-md mx-auto px-4 pt-5 space-y-3">
        <div>
          <p className="text-[11px] tracking-widest text-[#8e8e93] uppercase">Journey</p>
          <h1 className="text-3xl font-bold text-white">Progress</h1>
        </div>

        {!journey ? (
          <StartJourney onStart={startJourney} loading={starting} />
        ) : (
          <>
            <HabitStreaks
              habitStreaks={stats?.habitStreaks || {}}
              average={stats?.average || 0}
            />

            <Heatmap heatmap={stats?.heatmap || []} cycle={stats?.cycle} />

            <HabitCompletionList habitStats={stats?.habitStats || {}} />

            <div className="journey-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm4-4v4m6-4v4"
                  />
                </svg>
                <h2 className="text-sm font-semibold text-white">Food log</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#2c2c2e]/60 p-3">
                  <p className="text-xs text-[#8e8e93] mb-1">Total meals logged</p>
                  <p className="text-2xl font-bold text-white">{stats?.food?.totalMeals ?? 0}</p>
                </div>
                <div className="rounded-xl bg-[#2c2c2e]/60 p-3">
                  <p className="text-xs text-[#8e8e93] mb-1">Avg meals/day</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats?.food?.avgMealsPerDay ?? 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="journey-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-sm font-semibold text-white">Sleep schedule</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#2c2c2e]/60 p-3">
                  <p className="text-xs text-[#8e8e93] mb-1 flex items-center gap-1">
                    <span>Typical wake</span>
                  </p>
                  <p className="text-xl font-bold text-white">
                    {stats?.sleep?.typicalWake || '—'}
                  </p>
                </div>
                <div className="rounded-xl bg-[#2c2c2e]/60 p-3">
                  <p className="text-xs text-[#8e8e93] mb-1">Typical sleep</p>
                  <p className="text-xl font-bold text-white">
                    {stats?.sleep?.typicalSleep || '—'}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/archive"
              className="journey-card flex items-center justify-between p-4 hover:border-[#3a3a3c] transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-[#aeaeb2]">Past data</p>
                <p className="text-xs text-[#636366]">Old meal plan & nutrition analytics</p>
              </div>
              <svg className="w-4 h-4 text-[#636366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
