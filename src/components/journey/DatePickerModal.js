'use client';

import { useEffect, useState } from 'react';
import { formatDisplayDate } from '@/lib/journey';

export default function DatePickerModal({
  open,
  value,
  min,
  max,
  onClose,
  onSelect,
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  if (!open) return null;

  const clamp = (dateStr) => {
    if (min && dateStr < min) return min;
    if (max && dateStr > max) return max;
    return dateStr;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4">
      <div className="journey-card w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Select day</h3>
          <button type="button" onClick={onClose} className="text-[#8e8e93] text-sm">
            Close
          </button>
        </div>

        <p className="text-sm text-[#aeaeb2]">
          Editing{' '}
          <span className="text-white font-medium">{formatDisplayDate(draft)}</span>
        </p>

        <div>
          <label className="block text-xs text-[#8e8e93] mb-1">Date</label>
          <input
            type="date"
            value={draft}
            min={min || undefined}
            max={max || undefined}
            onChange={(e) => setDraft(clamp(e.target.value))}
            className="w-full rounded-xl bg-[#2c2c2e] border border-[#3a3a3c] text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#a3e635] [color-scheme:dark]"
          />
          {min || max ? (
            <p className="text-[11px] text-[#636366] mt-1.5">
              {min && max
                ? `From ${formatDisplayDate(min)} to ${formatDisplayDate(max)}`
                : min
                  ? `From ${formatDisplayDate(min)}`
                  : `Until ${formatDisplayDate(max)}`}
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          {max && draft !== max ? (
            <button
              type="button"
              onClick={() => setDraft(max)}
              className="flex-1 py-3 rounded-xl border border-[#3a3a3c] text-[#aeaeb2] text-sm font-medium"
            >
              Today
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onSelect(clamp(draft))}
            className="flex-1 py-3 rounded-xl bg-[#a3e635] text-black font-semibold"
          >
            Open day
          </button>
        </div>
      </div>
    </div>
  );
}
