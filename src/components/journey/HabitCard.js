'use client';

const ICONS = {
  meditate: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    />
  ),
  walk: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 5a2 2 0 11-4 0 2 2 0 014 0zM8 21l2-6 2 2 3-5 2 2M5 11l3 1 2-2"
    />
  ),
  read: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  ),
  work: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
  learn: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  ),
  travel: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 12L3 21l18-9L3 3l3 9zm0 0h7"
    />
  ),
};

export default function HabitCard({
  habitKey,
  label,
  done,
  onToggle,
  showNotes,
  hasNotes,
  onNotes,
  wide,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`journey-card relative flex flex-col items-center justify-center gap-2 py-4 px-2 transition-all active:scale-[0.98] ${
        wide ? 'min-h-[88px]' : 'min-h-[96px]'
      } ${done ? 'border-[#a3e635] ring-1 ring-[#a3e635]/40' : ''}`}
    >
      {showNotes && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onNotes?.();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onNotes?.();
            }
          }}
          className={`absolute top-2 right-2 p-1 rounded-md ${
            hasNotes ? 'text-[#a3e635]' : 'text-[#636366]'
          }`}
          aria-label={`Notes for ${label}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </span>
      )}

      {done ? (
        <span className="w-9 h-9 rounded-full bg-[#a3e635] flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : (
        <span className="w-9 h-9 rounded-full bg-[#2c2c2e] flex items-center justify-center text-[#8e8e93]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {ICONS[habitKey]}
          </svg>
        </span>
      )}

      <span className={`text-sm font-medium ${done ? 'text-[#a3e635]' : 'text-[#aeaeb2]'}`}>
        {label}
      </span>
    </button>
  );
}
