'use client';

import { formatDateLocal } from '@/lib/journey';

function cellColor(score, future) {
  if (future) return 'bg-[#1a1a1c] opacity-40';
  if (score <= 0) return 'bg-[#2c2c2e]';
  if (score < 0.25) return 'bg-[#3f6212]/50';
  if (score < 0.5) return 'bg-[#4d7c0f]/70';
  if (score < 0.75) return 'bg-[#65a30d]';
  return 'bg-[#a3e635]';
}

export default function Heatmap({ heatmap = [], cycle }) {
  const today = formatDateLocal(new Date());

  return (
    <div className="journey-card p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-sm font-semibold text-white">Daily completion</h2>
        </div>
        {cycle ? (
          <span className="text-[10px] text-[#8e8e93] uppercase tracking-wide">
            Cycle {cycle.cycle} · Day {cycle.dayInCycle}/30
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {heatmap.map((cell) => {
          const isToday = cell.date === today;
          return (
            <div
              key={cell.date}
              title={
                cell.future
                  ? `Day ${cell.day} (upcoming)`
                  : `Day ${cell.day}: ${cell.percent}%`
              }
              className={`aspect-square rounded-md ${cellColor(cell.score, cell.future)} ${
                isToday ? 'ring-2 ring-[#a3e635] ring-offset-1 ring-offset-black' : ''
              }`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-[#8e8e93]">
        <span>Less</span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#2c2c2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3f6212]/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#4d7c0f]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#65a30d]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635]" />
        <span>More</span>
      </div>
    </div>
  );
}
