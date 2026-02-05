'use client';

import { useState, useEffect } from 'react';

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
function MealCard({ dayData, showAsToday }) {
  const formattedDate = formatDate(dayData.date);
  const isTodayDate = isToday(dayData.date);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-4 transition-colors">
      <div className="mb-4">
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formattedDate.day}</p>
      </div>
      
      <div className="space-y-4">
        {dayData.meals.breakfast.food && (
          <div className="flex items-start">
            <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">Breakfast</div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{dayData.meals.breakfast.time}</div>
              <div className="text-base font-medium text-gray-900 dark:text-gray-100">{dayData.meals.breakfast.food}</div>
            </div>
          </div>
        )}
        
        {dayData.meals.lunch.food && (
          <div className="flex items-start">
            <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">Lunch</div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{dayData.meals.lunch.time}</div>
              <div className="text-base font-medium text-gray-900 dark:text-gray-100">{dayData.meals.lunch.food}</div>
            </div>
          </div>
        )}
        
        {dayData.meals.dinner.food && (
          <div className="flex items-start">
            <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">Dinner</div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{dayData.meals.dinner.time}</div>
              <div className="text-base font-medium text-gray-900 dark:text-gray-100">{dayData.meals.dinner.food}</div>
            </div>
          </div>
        )}
        
        {dayData.customEntries && dayData.customEntries.length > 0 && (
          <div className="flex items-start pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">Other</div>
            <div className="flex-1">
              <div className="text-base text-gray-900 dark:text-gray-100">
                {dayData.customEntries.join(', ')}
              </div>
            </div>
          </div>
        )}
        
        {!dayData.meals.breakfast.food && !dayData.meals.lunch.food && !dayData.meals.dinner.food && (!dayData.customEntries || dayData.customEntries.length === 0) && (
          <div className="text-sm text-gray-400 dark:text-gray-500 italic">No meals recorded</div>
        )}
      </div>
    </div>
  );
}

// Add Meal Modal Component
function AddMealModal({ isOpen, onClose, onAddCustomEntry }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Set default date to today
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      setSelectedDate(dateStr);
      
      // Set default time to current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    }
  }, [isOpen]);
  
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
function Modal({ isOpen, onClose, meals }) {
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
              <MealCard key={dayData.date} dayData={dayData} />
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
  const [meals, setMeals] = useState(mealData);
  
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      // Default to light mode
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">🍎 Meal Plan</h1>
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {/* All Meals Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-sm"
            >
              <span className="text-lg">🍽️</span>
              <span className="text-sm hidden sm:inline">All Meals</span>
              <span className="text-xs bg-green-600 px-2 py-0.5 rounded-full">{meals.length}</span>
            </button>
          </div>
        </div>
      </header>
      
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} meals={meals} />
      <AddMealModal 
        isOpen={isAddMealOpen} 
        onClose={() => setIsAddMealOpen(false)}
        onAddCustomEntry={addCustomEntry}
      />
    </div>
  );
}
