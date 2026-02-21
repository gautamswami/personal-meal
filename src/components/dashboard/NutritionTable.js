export default function NutritionTable({ nutrition, calories }) {
  if (!nutrition) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nutrition Breakdown
        </h3>
        <div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 text-sm">
          No nutrition data available
        </div>
      </div>
    );
  }

  const rows = [
    { label: 'Calories', value: calories, unit: 'kcal', color: 'text-green-500' },
    { label: 'Protein', value: nutrition.protein ?? 0, unit: 'g', color: 'text-blue-500' },
    { label: 'Carbohydrates', value: nutrition.carbs ?? 0, unit: 'g', color: 'text-yellow-500' },
    { label: 'Fat', value: nutrition.fat ?? 0, unit: 'g', color: 'text-red-500' },
    { label: 'Fiber', value: nutrition.fiber ?? 0, unit: 'g', color: 'text-purple-500' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Nutrition Breakdown
      </h3>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <span className="text-gray-700 dark:text-gray-300">{row.label}</span>
            <span className={`font-semibold ${row.color}`}>
              {typeof row.value === 'number' ? Math.round(row.value * 10) / 10 : row.value} {row.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
