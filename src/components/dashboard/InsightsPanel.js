export default function InsightsPanel({ insights, patterns }) {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💡';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Insights & Recommendations
      </h3>
      
      <div className="space-y-4">
        {insights?.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">
                    {insight.message}
                  </p>
                  {insight.recommendation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💡 {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No insights available yet. Keep logging meals to see personalized recommendations!
          </p>
        )}
      </div>

      {/* Patterns Summary */}
      {patterns && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Detected Patterns
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {patterns.lateNightEating?.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <div className="font-semibold text-red-700 dark:text-red-300">
                  {patterns.lateNightEating.length} Late Night Meals
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">After 10 PM</div>
              </div>
            )}
            {patterns.skippedMeals?.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                <div className="font-semibold text-orange-700 dark:text-orange-300">
                  {patterns.skippedMeals.length} Days
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">With Skipped Meals</div>
              </div>
            )}
            {patterns.highCalorieDays?.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                <div className="font-semibold text-yellow-700 dark:text-yellow-300">
                  {patterns.highCalorieDays.length} High Cal Days
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">&gt;2500 cal</div>
              </div>
            )}
            {patterns.lowCalorieDays?.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                  {patterns.lowCalorieDays.length} Low Cal Days
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">&lt;1200 cal</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
