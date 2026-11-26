'use client';

import { useState } from 'react';
import ExerciseAnimation from './ExerciseAnimation';

export default function ExerciseCard({ exercise, done, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`journey-card overflow-hidden transition-all ${
        done ? 'border-[#a3e635] ring-1 ring-[#a3e635]/30' : ''
      }`}
    >
      <div className="p-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-snug">{exercise.name}</p>
            <p className="text-[11px] text-[#8e8e93] mt-0.5 truncate">{exercise.equipment}</p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold transition-colors ${
              done
                ? 'bg-[#a3e635] text-black'
                : 'bg-[#2c2c2e] text-[#aeaeb2] hover:text-white'
            }`}
            aria-pressed={done}
          >
            {done ? 'Done' : 'Mark done'}
          </button>
        </div>

        <ExerciseAnimation
          animationId={exercise.animationId}
          sets={exercise.sets}
          reps={exercise.reps}
        />

        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#2c2c2e] text-[#a3e635] font-medium">
            {exercise.sets} × {exercise.reps}
          </span>
          {exercise.restSec > 0 ? (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#2c2c2e] text-[#aeaeb2]">
              Rest {exercise.restSec}s
            </span>
          ) : null}
          {exercise.muscles.map((m) => (
            <span
              key={m}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[#2c2c2e]/70 text-[#8e8e93]"
            >
              {m}
            </span>
          ))}
        </div>

        <p className="text-xs text-[#aeaeb2] leading-relaxed">{exercise.tip}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-[11px] text-[#a3e635] font-medium"
        >
          {open ? 'Hide steps' : 'How to do it'}
        </button>

        {open ? (
          <ol className="space-y-1.5 pl-4 list-decimal text-xs text-[#aeaeb2]">
            {exercise.steps.map((step) => (
              <li key={step} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
