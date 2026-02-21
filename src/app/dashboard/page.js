'use client';

import { useState, useEffect, useRef } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import CalorieChart from '@/components/dashboard/CalorieChart';
import MacroDistribution from '@/components/dashboard/MacroDistribution';
import MealCard from '@/components/dashboard/MealCard';
import NutritionTable from '@/components/dashboard/NutritionTable';
import InsightsPanel from '@/components/dashboard/InsightsPanel';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewMode, setViewMode] = useState('summary'); // summary, daily, weekly
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const cache = useRef({});

  // Load theme and username from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) setUsername(savedUsername);
  }, []);

  // Apply theme changes to <html>
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

  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, [selectedDate, viewMode]);

  const loadAnalytics = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    // Build a deterministic cache key for this request
    let cacheKey = viewMode;
    if (viewMode === 'daily') {
      cacheKey = `daily-${selectedDate}`;
    } else if (viewMode === 'weekly') {
      const start = format(startOfWeek(new Date(selectedDate)), 'yyyy-MM-dd');
      const end = format(endOfWeek(new Date(selectedDate)), 'yyyy-MM-dd');
      cacheKey = `weekly-${start}_${end}`;
    }

    // Return cached result instantly, no loading spinner
    if (cache.current[cacheKey] !== undefined) {
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
        const end = format(endOfWeek(new Date(selectedDate)), 'yyyy-MM-dd');
        url += `&startDate=${start}&endDate=${end}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        cache.current[cacheKey] = data.data;
        setAnalyticsData(data.data);
      } else if (data.message && data.message.includes('No processed meals')) {
        cache.current[cacheKey] = null;
        setAnalyticsData(null);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processExistingMeals = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const mealsResponse = await fetch('/api/meals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const mealsData = await mealsResponse.json();
      
      if (!mealsData.meals || mealsData.meals.length === 0) {
        alert('No meals found to process');
        return;
      }

      // Prepare meals for processing — only use what the user actually ate (customEntries)
      const mealsToProcess = [];
      for (const dayData of mealsData.meals) {
        if (dayData.customEntries && dayData.customEntries.length > 0) {
          dayData.customEntries.forEach(entry => {
            mealsToProcess.push({
              date: dayData.date,
              type: 'actual',
              text: entry
            });
          });
        }
      }

      if (mealsToProcess.length === 0) {
        alert('No actual meals found to analyse. Use the + button on each day\'s card to log what you ate.');
        return;
      }

      // Send to processing API
      const processResponse = await fetch('/api/process-meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ meals: mealsToProcess })
      });

      const result = await processResponse.json();
      
      if (result.success) {
        alert(`Successfully processed ${result.processedCount} meals!`);
        loadAnalytics();
      } else {
        alert('Failed to process meals: ' + result.error);
      }
    } catch (error) {
      console.error('Processing error:', error);
      alert('Error processing meals: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Analytics Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your meals need to be processed before analytics can be generated.
            </p>
            <button
              onClick={processExistingMeals}
              disabled={processing}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {processing ? 'Processing...' : 'Process My Meals'}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              This will analyze your meal data using AI to calculate nutrition and patterns.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo + back */}
          <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            🍎 Meal Plan
          </a>

          {/* Hamburger Button */}
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
      </header>

      {/* Hamburger Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col transition-colors">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1 px-3 py-4 flex-1">
              {/* Username */}
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

              {/* Dark / Light Mode */}
              <button
                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {isDarkMode ? (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </span>
              </button>

              {/* Home */}
              <a
                href="/"
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

              {/* Logout */}
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
            {/* Left Column: Summary Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calories Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Daily Calories
                </h3>
                <div className="text-4xl font-bold text-green-500">
                  {analyticsData.totalCalories}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {analyticsData.mealCount} meals logged
                </p>
              </div>

              {/* Macros */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Macronutrients
                </h3>
                {analyticsData.macros
                  ? <MacroDistribution macros={analyticsData.macros} />
                  : <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-500 text-sm">No macro data for this day</div>
                }
              </div>

              {/* Meals Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Meals
                </h3>
                <div className="space-y-4">
                  {analyticsData.meals?.map((meal, index) => (
                    <MealCard key={index} meal={meal} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Nutrition Details */}
            <div className="space-y-6">
              <NutritionTable
                nutrition={analyticsData.macros ?? null}
                calories={analyticsData.totalCalories}
              />
            </div>
          </div>
        )}

        {/* Weekly/Summary View */}
        {(viewMode === 'weekly' || viewMode === 'summary') && analyticsData && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg Calories</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analyticsData.summary?.averageCalories || 0}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg Protein</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analyticsData.summary?.averageMacros?.protein || 0}g
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">Meals/Day</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analyticsData.summary?.averageMealsPerDay || 0}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">Timing Score</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {analyticsData.mealTimingScore || 0}
                </div>
              </div>
            </div>

            {/* Calorie Trend Chart */}
            {analyticsData.days && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Calorie Trend
                </h3>
                <CalorieChart data={analyticsData.days} />
              </div>
            )}

            {/* Insights */}
            {analyticsData.insights && (
              <InsightsPanel insights={analyticsData.insights} patterns={analyticsData.patterns} />
            )}

            {/* Most Consumed Foods */}
            {analyticsData.mostConsumedFoods && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Most Consumed Foods
                </h3>
                <div className="space-y-2">
                  {analyticsData.mostConsumedFoods.map((food, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
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
