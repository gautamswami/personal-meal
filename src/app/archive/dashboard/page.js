'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import CalorieChart from '@/components/dashboard/CalorieChart';
import MacroDistribution from '@/components/dashboard/MacroDistribution';
import MealCard from '@/components/dashboard/MealCard';
import NutritionTable from '@/components/dashboard/NutritionTable';
import InsightsPanel from '@/components/dashboard/InsightsPanel';

// ─── tiny toast ────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const colours =
    type === 'success'
      ? 'bg-green-600 text-white'
      : type === 'error'
      ? 'bg-red-600 text-white'
      : 'bg-gray-700 text-white';
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3 ${colours}`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}

// ─── month / day helpers ────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} (${DAYS[d.getDay()]})`;
}

// ─── export helper ──────────────────────────────────────────────────────────────
async function downloadMealsCSV(token) {
  const res  = await fetch('/api/meals', { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  const meals = data.meals || [];

  const rows = [['Date', 'Day', 'Time', 'Meal Description']];

  for (const day of meals) {
    if (!day.customEntries || day.customEntries.length === 0) continue;
    const d    = new Date(day.date + 'T00:00:00');
    const date = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    const dow  = DAYS[d.getDay()];

    for (const entry of day.customEntries) {
      const dashIdx = entry.indexOf('–');
      let time = '', food = entry;
      if (dashIdx !== -1) {
        time = entry.slice(0, dashIdx).trim();
        food = entry.slice(dashIdx + 1).trim();
      }
      rows.push([date, dow, time, food]);
    }
  }

  const csv  = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `meal-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── main component ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewMode, setViewMode]         = useState('summary');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [processing, setProcessing]     = useState(false);
  const [exporting, setExporting]       = useState(false);
  const [isDarkMode, setIsDarkMode]     = useState(false);
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [username, setUsername]         = useState('');
  const [toast, setToast]               = useState(null); // { message, type }
  const [showConfirm, setShowConfirm]   = useState(false);
  const cache = useRef({});

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Load theme and username from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
    const saved = localStorage.getItem('username');
    if (saved) setUsername(saved);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  // ── analytics loader ──────────────────────────────────────────────────────
  const loadAnalytics = useCallback(async (bustCache = false) => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/'; return; }

    let cacheKey = viewMode;
    if (viewMode === 'daily') {
      cacheKey = `daily-${selectedDate}`;
    } else if (viewMode === 'weekly') {
      const start = format(startOfWeek(new Date(selectedDate)), 'yyyy-MM-dd');
      const end   = format(endOfWeek(new Date(selectedDate)),   'yyyy-MM-dd');
      cacheKey    = `weekly-${start}_${end}`;
    }

    if (!bustCache && cache.current[cacheKey] !== undefined) {
      setAnalyticsData(cache.current[cacheKey]);
      return;
    }

    setLoading(true);
    try {
      let url = `/api/analytics?type=${viewMode}`;
      if (viewMode === 'daily') {
        url += `&date=${selectedDate}`;
      } else if (viewMode === 'weekly') {
        const start = format(startOfWeek(new Date(selectedDate)), 'yyyy-MM-dd');
        const end   = format(endOfWeek(new Date(selectedDate)),   'yyyy-MM-dd');
        url += `&startDate=${start}&endDate=${end}`;
      }

      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data     = await response.json();

      if (data.success) {
        cache.current[cacheKey] = data.data;
        setAnalyticsData(data.data);
      } else {
        cache.current[cacheKey] = null;
        setAnalyticsData(null);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedDate]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  // ── process / re-analyze ──────────────────────────────────────────────────
  const processExistingMeals = async () => {
    setProcessing(true);
    setShowConfirm(false);
    try {
      const token       = localStorage.getItem('token');
      const mealsRes    = await fetch('/api/meals', { headers: { Authorization: `Bearer ${token}` } });
      const mealsData   = await mealsRes.json();

      if (!mealsData.meals || mealsData.meals.length === 0) {
        showToast('No meals found to process.', 'error');
        return;
      }

      const mealsToProcess = [];
      for (const day of mealsData.meals) {
        if (day.customEntries && day.customEntries.length > 0) {
          day.customEntries.forEach(entry => {
            mealsToProcess.push({ date: day.date, type: 'actual', text: entry });
          });
        }
      }

      if (mealsToProcess.length === 0) {
        showToast("No actual meals logged yet. Use the + button on each day's card to record what you ate.", 'error');
        return;
      }

      const processRes = await fetch('/api/process-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ meals: mealsToProcess }),
      });
      const result = await processRes.json();

      if (result.success) {
        // bust the entire cache so fresh data is loaded
        cache.current = {};
        await loadAnalytics(true);
        showToast(`Successfully analysed ${result.processedCount} meal entries!`, 'success');
      } else {
        showToast('Failed to process meals: ' + result.error, 'error');
      }
    } catch (err) {
      console.error('Processing error:', err);
      showToast('Error processing meals: ' + err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  // ── export ────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      await downloadMealsCSV(token);
      showToast('Meal log exported successfully!', 'success');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  // ── action bar (Re-analyze + Export) — always shown once header renders ──
  const ActionBar = () => (
    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-700 flex-wrap">
      <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
        Re-analyze to include newly added meals
      </p>
      <div className="flex items-center gap-2 ml-auto">
        {/* Export CSV */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>

        {/* Re-analyze */}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={processing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analysing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-analyze
            </>
          )}
        </button>
      </div>
    </div>
  );

  // ── confirm dialog ────────────────────────────────────────────────────────
  const ConfirmDialog = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowConfirm(false)} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Re-analyze All Meals?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This will re-process all your logged meals using AI and update all charts and insights. It may take a moment.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={processExistingMeals}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Yes, Re-analyze
          </button>
        </div>
      </div>
    </div>
  );

  // ── loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading analytics…</div>
      </div>
    );
  }

  // ── no data state ─────────────────────────────────────────────────────────
  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-4">
        {showConfirm && <ConfirmDialog />}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <a href="/archive" className="text-green-500 hover:text-green-600 text-sm font-medium">← Back to Meal Plan</a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Analytics Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Your meals need to be processed before analytics can be generated.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Make sure you've logged what you ate using the + button on each day's card.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={processing}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {processing ? 'Processing…' : 'Process My Meals'}
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {exporting ? 'Exporting…' : 'Export Meal Log'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── full dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {showConfirm && <ConfirmDialog />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/archive" className="text-xl font-bold text-gray-900 dark:text-white">🍎 Meal Plan</a>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Tab Bar */}
        <div className="max-w-4xl mx-auto px-4 flex gap-0 border-t border-gray-100 dark:border-gray-700">
          {[
            { key: 'summary', label: 'Summary' },
            { key: 'daily',   label: 'Daily' },
            { key: 'weekly',  label: 'Weekly' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                viewMode === tab.key
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Bar — always visible */}
        <ActionBar />
      </header>

      {/* Hamburger Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-72 max-w-full bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col transition-colors">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1 px-3 py-4 flex-1">
              {username && (
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 mb-2">
                  <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">@{username}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {isDarkMode
                    ? <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                    : <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  }
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </span>
              </button>

              <a
                href="/archive"
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Home</span>
              </a>

              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Date Selector */}
        {viewMode !== 'summary' && (
          <div className="mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}

        {/* Daily View */}
        {viewMode === 'daily' && analyticsData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Calories</h3>
                <div className="text-4xl font-bold text-green-500">{analyticsData.totalCalories}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{analyticsData.mealCount} meals logged</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Macronutrients</h3>
                {analyticsData.macros
                  ? <MacroDistribution macros={analyticsData.macros} />
                  : <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-500 text-sm">No macro data for this day</div>
                }
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meals</h3>
                <div className="space-y-4">
                  {analyticsData.meals?.map((meal, i) => <MealCard key={i} meal={meal} />)}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <NutritionTable nutrition={analyticsData.macros ?? null} calories={analyticsData.totalCalories} />
            </div>
          </div>
        )}

        {/* Weekly / Summary View */}
        {(viewMode === 'weekly' || viewMode === 'summary') && analyticsData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Calories',  value: analyticsData.summary?.averageCalories || 0,               suffix: '' },
                { label: 'Avg Protein',   value: analyticsData.summary?.averageMacros?.protein || 0,         suffix: 'g' },
                { label: 'Meals/Day',     value: analyticsData.summary?.averageMealsPerDay || 0,             suffix: '' },
                { label: 'Timing Score',  value: analyticsData.mealTimingScore || 0,                         suffix: '' },
              ].map(card => (
                <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{card.value}{card.suffix}</div>
                </div>
              ))}
            </div>

            {analyticsData.days && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calorie Trend</h3>
                <CalorieChart data={analyticsData.days} />
              </div>
            )}

            {analyticsData.insights && (
              <InsightsPanel insights={analyticsData.insights} patterns={analyticsData.patterns} />
            )}

            {analyticsData.mostConsumedFoods && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Consumed Foods</h3>
                <div className="space-y-2">
                  {analyticsData.mostConsumedFoods.map((food, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{food.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{food.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
