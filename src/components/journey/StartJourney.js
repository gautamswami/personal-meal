'use client';

export default function StartJourney({ onStart, loading }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 min-h-[60vh]">
      <p className="text-xs tracking-widest text-[#8e8e93] uppercase mb-3">Your Journey</p>
      <h1 className="text-3xl font-bold text-white mb-3">Ready to begin?</h1>
      <p className="text-[#aeaeb2] text-sm max-w-xs mb-8">
        Tap start and today becomes Day 1. Keep going as long as you want — progress is shown in 30-day cycles.
      </p>
      <button
        type="button"
        disabled={loading}
        onClick={onStart}
        className="px-8 py-3.5 rounded-2xl bg-[#a3e635] text-black font-semibold disabled:opacity-50"
      >
        {loading ? 'Starting…' : 'Start Journey'}
      </button>
    </div>
  );
}
