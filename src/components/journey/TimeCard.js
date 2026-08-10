'use client';

import { useRef } from 'react';
import { fromInputTime, toInputTime } from './MealAddModal';

export default function TimeCard({ label, icon, value, onChange }) {
  const inputRef = useRef(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.showPicker?.() || inputRef.current?.click()}
      className="journey-card relative flex flex-col items-start gap-2 p-3.5 min-h-[88px] text-left w-full"
    >
      <div className="flex items-center gap-2">
        <span className="text-[#aeaeb2]">{icon}</span>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <div className="flex items-center justify-between w-full mt-auto">
        <span className={`font-mono text-base tracking-wide ${value ? 'text-white' : 'text-[#636366]'}`}>
          {value || '-- : -- --'}
        </span>
        <span className="text-[#636366]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </div>
      <input
        ref={inputRef}
        type="time"
        value={toInputTime(value)}
        onChange={(e) => onChange(e.target.value ? fromInputTime(e.target.value) : null)}
        className="sr-only"
        tabIndex={-1}
      />
    </button>
  );
}
