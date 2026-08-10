'use client';

import { useEffect, useState } from 'react';

function nowTime12() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** Convert "3:35 PM" ↔ input[type=time] "15:35" */
export function toInputTime(display) {
  if (!display) return '';
  const m = String(display).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return '';
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

export function fromInputTime(value) {
  if (!value) return '';
  const [hs, ms] = value.split(':');
  let h = parseInt(hs, 10);
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${ms} ${ap}`;
}

export default function MealAddModal({ open, onClose, onSave }) {
  const [text, setText] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (open) {
      setText('');
      setTime(toInputTime(nowTime12()));
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4">
      <div className="journey-card w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Log meal</h3>
          <button type="button" onClick={onClose} className="text-[#8e8e93] text-sm">
            Close
          </button>
        </div>
        <div>
          <label className="block text-xs text-[#8e8e93] mb-1">What did you eat?</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Oatmeal with berries"
            className="w-full rounded-xl bg-[#2c2c2e] border border-[#3a3a3c] text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#a3e635]"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs text-[#8e8e93] mb-1">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl bg-[#2c2c2e] border border-[#3a3a3c] text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#a3e635]"
          />
        </div>
        <button
          type="button"
          disabled={!text.trim()}
          onClick={() => onSave({ text: text.trim(), time: fromInputTime(time) || nowTime12() })}
          className="w-full py-3 rounded-xl bg-[#a3e635] text-black font-semibold disabled:opacity-40"
        >
          Add meal
        </button>
      </div>
    </div>
  );
}
