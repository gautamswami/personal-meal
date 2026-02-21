'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Meal data from Feb 5 to March 15, 2026
const mealData = [
  {
    date: '2026-02-05',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Papaya' },
      lunch: { time: '2:00 PM', food: 'Banana (2)' },
      dinner: { time: '8:00 PM', food: 'Papaya' }
    },
    customEntries: []
  },
  {
    date: '2026-02-06',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Watermelon' },
      lunch: { time: '2:00 PM', food: 'Apple (2)' },
      dinner: { time: '8:00 PM', food: 'Watermelon' }
    }
  },
  {
    date: '2026-02-07',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Muskmelon' },
      lunch: { time: '2:00 PM', food: 'Orange (3–4)' },
      dinner: { time: '8:00 PM', food: 'Papaya' }
    }
  },
  {
    date: '2026-02-08',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Papaya' },
      lunch: { time: '2:00 PM', food: 'Banana (2)' },
      dinner: { time: '8:00 PM', food: 'Watermelon' }
    }
  },
  {
    date: '2026-02-09',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Watermelon' },
      lunch: { time: '2:00 PM', food: 'Apple (2)' },
      dinner: { time: '8:00 PM', food: 'Papaya' }
    }
  },
  {
    date: '2026-02-10',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Muskmelon' },
      lunch: { time: '2:00 PM', food: 'Orange (3–4)' },
      dinner: { time: '8:00 PM', food: 'Watermelon' }
    }
  },
  {
    date: '2026-02-11',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Papaya' },
      lunch: { time: '2:00 PM', food: 'Banana (2)' },
      dinner: { time: '8:00 PM', food: 'Papaya' }
    }
  },
  {
    date: '2026-02-12',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Watermelon' },
      lunch: { time: '2:00 PM', food: 'Apple (2)' },
      dinner: { time: '8:00 PM', food: 'Watermelon' }
    }
  },
  {
    date: '2026-02-13',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Muskmelon' },
      lunch: { time: '2:00 PM', food: 'Orange (3–4)' },
      dinner: { time: '8:00 PM', food: 'Papaya' }
    }
  },
  {
    date: '2026-02-14',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Papaya' },
      lunch: { time: '2:00 PM', food: 'Banana (2)' },
      dinner: { time: '8:00 PM', food: 'Watermelon' }
    }
  },
  {
    date: '2026-02-15',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-02-16',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-02-17',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-02-18',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable poha' },
      lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-02-19',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-02-20',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-02-21',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup' }
    }
  },
  {
    date: '2026-02-22',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-02-23',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-02-24',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-02-25',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable poha' },
      lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-02-26',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-02-27',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-02-28',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup' }
    }
  },
  {
    date: '2026-03-01',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-03-02',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-03-03',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-03-04',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable poha' },
      lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-03-05',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-03-06',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-03-07',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup' }
    }
  },
  {
    date: '2026-03-08',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-03-09',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Rajma + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-03-10',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-03-11',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable poha' },
      lunch: { time: '2:00 PM', food: 'Chole + salad + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  },
  {
    date: '2026-03-12',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Stir-fried veggies + paneer' }
    }
  },
  {
    date: '2026-03-13',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Sprouts salad' },
      lunch: { time: '2:00 PM', food: 'Rajma/chole + salad' },
      dinner: { time: '8:00 PM', food: '2 boiled eggs + salad' }
    }
  },
  {
    date: '2026-03-14',
    meals: {
      breakfast: { time: '10:30 AM', food: 'Vegetable oats' },
      lunch: { time: '2:00 PM', food: 'Paneer bhurji + veggies + 1 roti' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup' }
    }
  },
  {
    date: '2026-03-15',
    meals: {
      breakfast: { time: '10:30 AM', food: '2 boiled eggs + veggies' },
      lunch: { time: '2:00 PM', food: 'Dal + sabzi + 1 roti + curd' },
      dinner: { time: '8:00 PM', food: 'Vegetable soup + sprouts' }
    }
  }
];

// Helper function to format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    day: days[date.getDay()],
    date: date.getDate(),
    month: months[date.getMonth()],
    fullDate: `${date.getDate()} ${months[date.getMonth()]}`
  };
};

// Helper function to check if date is today
const isToday = (dateStr) => {
  const today = new Date();
  const checkDate = new Date(dateStr);
  return today.toDateString() === checkDate.toDateString();
};

// MealCard Component
function MealCard({ dayData, showAsToday, onAddMeal }) {
  const formattedDate = formatDate(dayData.date);
  const isTodayDate = isToday(dayData.date);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-4 transition-colors">
      <div className="mb-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formattedDate.fullDate}
            </h2>
            {isTodayDate && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Today
              </span>
            )}
          </div>
          {onAddMeal && (
            <button
              onClick={() => onAddMeal(dayData.date)}
              className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
              aria-label="Add meal to this date"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formattedDate.day}</p>
      </div>
      
      <div className="space-y-4">
        {/* What I Actually Ate — shown first and prominently */}
        {dayData.customEntries && dayData.customEntries.length > 0 && (
          <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">What I Ate</span>
            </div>
            <div className="space-y-1">
              {dayData.customEntries.map((entry, i) => (
                <div key={i} className="text-sm text-gray-800 dark:text-gray-200">{entry}</div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested meals — shown below with a muted label */}
        {(dayData.meals?.breakfast?.food || dayData.meals?.lunch?.food || dayData.meals?.dinner?.food) && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Suggested</span>
            </div>
            <div className="space-y-2 opacity-70">
              {dayData.meals?.breakfast?.food && (
                <div className="flex items-start">
                  <div className="w-24 text-sm font-medium text-gray-500 dark:text-gray-500">Breakfast</div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">{dayData.meals.breakfast.time}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{dayData.meals.breakfast.food}</div>
                  </div>
                </div>
              )}
              {dayData.meals?.lunch?.food && (
                <div className="flex items-start">
                  <div className="w-24 text-sm font-medium text-gray-500 dark:text-gray-500">Lunch</div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">{dayData.meals.lunch.time}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{dayData.meals.lunch.food}</div>
                  </div>
                </div>
              )}
              {dayData.meals?.dinner?.food && (
                <div className="flex items-start">
                  <div className="w-24 text-sm font-medium text-gray-500 dark:text-gray-500">Dinner</div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">{dayData.meals.dinner.time}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{dayData.meals.dinner.food}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!dayData.meals?.breakfast?.food && !dayData.meals?.lunch?.food && !dayData.meals?.dinner?.food && (!dayData.customEntries || dayData.customEntries.length === 0) && (
          <div className="text-sm text-gray-400 dark:text-gray-500 italic">No meals recorded</div>
        )}
      </div>
    </div>
  );
}

// Add Meal Modal Component
function AddMealModal({ isOpen, onClose, onAddCustomEntry, preSelectedDate }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Set default date - use preSelectedDate if provided, otherwise today
      const dateStr = preSelectedDate || new Date().toISOString().split('T')[0];
      setSelectedDate(dateStr);
      
      // Set default time to current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    }
  }, [isOpen, preSelectedDate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !foodDescription) return;
    
    // Convert 24h time to 12h format
    const [hours, minutes] = selectedTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;
    
    onAddCustomEntry(selectedDate, formattedTime, foodDescription);
    
    // Reset form
    setFoodDescription('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Meal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-light leading-none"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What did you eat?
              </label>
              <textarea
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                placeholder="e.g., Papaya, Banana (2), Oatmeal with fruits, etc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="3"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
              >
                Add Meal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal Component with optimized rendering
function Modal({ isOpen, onClose, meals, onAddMealForDate }) {
  const [visibleCount, setVisibleCount] = useState(10);
  
  // Reset visible count when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVisibleCount(10);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sortedMeals = [...meals].sort((a, b) => new Date(a.date) - new Date(b.date));
  const visibleMeals = sortedMeals.slice(0, visibleCount);
  const hasMore = visibleCount < sortedMeals.length;
  
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, sortedMeals.length));
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-start justify-center p-4">
        <div className="relative bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto transition-colors">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-2xl flex justify-between items-center z-10 shadow-sm transition-colors">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Meals</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {sortedMeals.length} days • {sortedMeals[0]?.date && formatDate(sortedMeals[0].date).fullDate} - {sortedMeals[sortedMeals.length - 1]?.date && formatDate(sortedMeals[sortedMeals.length - 1].date).fullDate}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-light leading-none w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            {visibleMeals.map((dayData, index) => (
              <MealCard key={dayData.date} dayData={dayData} onAddMeal={onAddMealForDate} />
            ))}
            
            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full py-3 px-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-colors shadow-sm"
              >
                Load More ({sortedMeals.length - visibleCount} more days)
              </button>
            )}
            
            {!hasMore && sortedMeals.length > 10 && (
              <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                All {sortedMeals.length} days loaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [preSelectedDate, setPreSelectedDate] = useState(null);
  const [meals, setMeals] = useState(mealData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Prevent the save-to-DB effect from firing before the initial load completes
  const initialLoadDone = useRef(false);
  
  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    
    if (token && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
      loadMealsFromDB(token);
    } else {
      setIsLoading(false);
      initialLoadDone.current = true;
      setShowAuthModal(true);
    }
  }, []);
  
  // Load meals from database
  const loadMealsFromDB = async (token) => {
    try {
      const response = await fetch('/api/meals', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          // DB is the source of truth — update localStorage to match so
          // stale local data can never overwrite the server copy later.
          localStorage.setItem('meals', JSON.stringify(data.meals));
          setMeals(data.meals);
        } else {
          const localMeals = localStorage.getItem('meals');
          if (localMeals) {
            const parsedMeals = JSON.parse(localMeals);
            setMeals(parsedMeals);
            saveMealsToDB(parsedMeals, token);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load meals from DB:', error);
      const localMeals = localStorage.getItem('meals');
      if (localMeals) {
        setMeals(JSON.parse(localMeals));
      }
    } finally {
      setIsLoading(false);
      initialLoadDone.current = true;
    }
  };
  
  // Save meals to database
  const saveMealsToDB = useCallback(async (mealsData, token) => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;
    
    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ meals: mealsData }),
      });
    } catch (error) {
      console.error('Failed to save meals to DB:', error);
    }
  }, []);
  
  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (!username.trim()) {
      setAuthError('Username is required');
      return;
    }
    
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setIsAuthenticated(true);
        setUsername(data.username);
        setShowAuthModal(false);
        
        if (authMode === 'signup') {
          const localMeals = localStorage.getItem('meals');
          if (localMeals) {
            const parsedMeals = JSON.parse(localMeals);
            setMeals(parsedMeals);
            saveMealsToDB(parsedMeals, data.token);
          }
          initialLoadDone.current = true;
        } else {
          // Reset the flag so the save-to-DB effect doesn't fire with stale
          // hardcoded mealData before loadMealsFromDB has a chance to fetch
          // the real data from the server.
          initialLoadDone.current = false;
          loadMealsFromDB(data.token);
        }
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('Failed to authenticate. Please try again.');
    }
  };
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    setShowAuthModal(true);
  };
  
  // Load theme and meals from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);
  
  // Apply theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // Save meals to localStorage and DB whenever they change,
  // but only after the initial load has completed to avoid overwriting DB data
  useEffect(() => {
    if (isAuthenticated && meals.length > 0 && initialLoadDone.current) {
      localStorage.setItem('meals', JSON.stringify(meals));
      saveMealsToDB(meals);
    }
  }, [meals, isAuthenticated, saveMealsToDB]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Get today's date and find upcoming meals
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Sort meals by date
  const sortedMeals = [...meals].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Find meals starting from today - limit to 7 cards for optimization
  const upcomingMeals = sortedMeals.filter(meal => meal.date >= todayStr).slice(0, 7);
  
  // If no upcoming meals (date is past the data range), show the last 7 days
  const displayMeals = upcomingMeals.length > 0 ? upcomingMeals : sortedMeals.slice(-7);
  
  // Function to add a custom meal entry
  const addCustomEntry = (date, time, food) => {
    // Find if date already exists
    const existingMealIndex = meals.findIndex(m => m.date === date);
    
    const newEntry = `${time} – ${food}`;
    
    if (existingMealIndex !== -1) {
      // Add to existing date
      const updatedMeals = [...meals];
      if (!updatedMeals[existingMealIndex].customEntries) {
        updatedMeals[existingMealIndex].customEntries = [];
      }
      updatedMeals[existingMealIndex].customEntries.push(newEntry);
      setMeals(updatedMeals);
    } else {
      // Create new date with only custom entry
      const newMeal = {
        date,
        meals: {
          breakfast: { time: '', food: '' },
          lunch: { time: '', food: '' },
          dinner: { time: '', food: '' }
        },
        customEntries: [newEntry]
      };
      setMeals([...meals, newMeal]);
    }
  };
  
  // Function to handle adding meal from a specific date
  const handleAddMealForDate = (date) => {
    setPreSelectedDate(date);
    setIsAddMealOpen(true);
  };
  
  // Function to close add meal modal and reset pre-selected date
  const handleCloseAddMeal = () => {
    setIsAddMealOpen(false);
    setPreSelectedDate(null);
  };
  
  // If loading or not authenticated, show auth screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transition-colors">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🍎 Meal Plan</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {authMode === 'login' ? 'Welcome back!' : 'Create your account'}
                </p>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {authError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {authError}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                >
                  {authMode === 'login' ? 'Login' : 'Sign Up'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setAuthError('');
                  }}
                  className="text-green-500 hover:text-green-600 text-sm font-medium"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">🍎 Meal Plan</h1>

          <div className="flex items-center gap-2">
            {/* All Meals Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-sm"
            >
              <span className="text-lg">🍽️</span>
              <span className="text-sm hidden sm:inline">All Meals</span>
              <span className="text-xs bg-green-600 px-2 py-0.5 rounded-full">{meals.length}</span>
            </button>

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
        </div>
      </header>

      {/* Hamburger Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-72 max-w-full bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col transition-colors">
            {/* Drawer Header */}
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

            {/* Drawer Body */}
            <div className="flex flex-col gap-1 px-3 py-4 flex-1">
              {/* Username */}
              {isAuthenticated && (
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

              {/* Dashboard */}
              {isAuthenticated && (
                <a
                  href="/dashboard"
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Dashboard</span>
                </a>
              )}

              {/* Logout */}
              {isAuthenticated && (
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left mt-auto"
                >
                  <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {displayMeals.map((dayData, index) => (
          <MealCard key={index} dayData={dayData} showAsToday={index === 0} />
        ))}
        
        {displayMeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No meal data available
          </div>
        )}
      </main>
      
      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddMealOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-30 group"
        aria-label="Add meal"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      {/* Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        meals={meals}
        onAddMealForDate={handleAddMealForDate}
      />
      <AddMealModal 
        isOpen={isAddMealOpen} 
        onClose={handleCloseAddMeal}
        onAddCustomEntry={addCustomEntry}
        preSelectedDate={preSelectedDate}
      />
    </div>
  );
}
