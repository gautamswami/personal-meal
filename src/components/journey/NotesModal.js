'use client';

import { useEffect, useState } from 'react';

export default function NotesModal({ open, title, initialNotes, onClose, onSave }) {
  const [notes, setNotes] = useState(initialNotes || '');

  useEffect(() => {
    if (open) setNotes(initialNotes || '');
  }, [open, initialNotes]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4">
      <div className="journey-card w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title} notes</h3>
          <button type="button" onClick={onClose} className="text-[#8e8e93] text-sm">
            Close
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Optional notes…"
          className="w-full rounded-xl bg-[#2c2c2e] border border-[#3a3a3c] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#a3e635]"
        />
        <button
          type="button"
          onClick={() => onSave(notes)}
          className="w-full py-3 rounded-xl bg-[#a3e635] text-black font-semibold"
        >
          Save
        </button>
      </div>
    </div>
  );
}
