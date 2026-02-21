export default function MealCard({ meal }) {
  const mealTypeColors = {
    breakfast: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    lunch: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    dinner: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    other: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mealTypeColors[meal.type] || mealTypeColors.other}`}>
            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{meal.time}</span>
        </div>
        <div className="text-lg font-semibold text-green-500">
          {Math.round(meal.nutrition?.calories || 0)} cal
        </div>
      </div>
      
      <div className="space-y-2">
        {meal.items?.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300 capitalize">
              {item.name} {item.quantity && `(${item.quantity})`}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {Math.round(item.calories)} cal
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Protein:</span>
          <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
            {Math.round(meal.nutrition?.protein || 0)}g
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Carbs:</span>
          <span className="ml-1 font-semibold text-yellow-600 dark:text-yellow-400">
            {Math.round(meal.nutrition?.carbs || 0)}g
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Fat:</span>
          <span className="ml-1 font-semibold text-red-600 dark:text-red-400">
            {Math.round(meal.nutrition?.fat || 0)}g
          </span>
        </div>
      </div>
    </div>
  );
}
