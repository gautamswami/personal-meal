'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function MacroDistribution({ macros }) {
  if (!macros) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-500 text-sm">
        No macro data available for this day
      </div>
    );
  }

  const data = [
    { name: 'Protein', value: macros.protein ?? 0, color: '#3B82F6' },
    { name: 'Carbs', value: macros.carbs ?? 0, color: '#EAB308' },
    { name: 'Fat', value: macros.fat ?? 0, color: '#EF4444' }
  ];

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-3 gap-4">
        {data.map((macro, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold" style={{ color: macro.color }}>
              {macro.value}g
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{macro.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
