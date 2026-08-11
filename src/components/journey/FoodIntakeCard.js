'use client';

export default function FoodIntakeCard({ meals = [], onAdd, onDelete }) {
  return (
    <div className="journey-card p-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center text-[#aeaeb2]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm4-4v4m6-4v4"
              />
            </svg>
          </span>
          <span className="text-sm font-medium text-white">Food intake</span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="w-8 h-8 rounded-full border border-[#3a3a3c] flex items-center justify-center text-[#aeaeb2] hover:text-white"
          aria-label="Add meal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {meals.length === 0 ? (
        <p className="text-sm text-[#8e8e93] py-1">No meals logged yet</p>
      ) : (
        <ul className="space-y-1.5 max-h-24 overflow-y-auto">
          {meals.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-2 text-sm text-[#aeaeb2]"
            >
              <span className="truncate">
                <span className="text-[#8e8e93]">{m.time}</span>
                <span className="mx-1.5">–</span>
                <span className="text-white">{m.text}</span>
              </span>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(m.id)}
                  className="text-[#636366] hover:text-red-400 shrink-0 text-xs"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
