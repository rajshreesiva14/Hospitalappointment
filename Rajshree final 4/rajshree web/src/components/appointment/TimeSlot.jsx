import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export const TimeSlot = ({
  slots = [],
  selectedSlot,
  onSelectSlot,
  disabled = false
}) => {
  // Experiment 2 h: Conditional rendering: "No time slots available"
  if (!slots || slots.length === 0) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs flex items-center gap-2"
      >
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>No time slots available for this doctor on the selected date. Please pick another date.</span>
      </div>
    );
  }

  const handleKeyDown = (e, slot) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelectSlot(slot);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1.5" id="time-slots-heading">
          <Clock className="w-3.5 h-3.5 text-teal-600" /> Available Time Slots
        </span>
        <span className="text-[11px] font-normal text-slate-400">
          ({slots.length} slots open)
        </span>
      </div>

      {/* ARIA radiogroup for accessible appointment controls */}
      <div
        role="radiogroup"
        aria-labelledby="time-slots-heading"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
      >
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Time slot ${slot}`}
              tabIndex={0}
              disabled={disabled}
              onClick={() => onSelectSlot(slot)}
              onKeyDown={(e) => handleKeyDown(e, slot)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 cursor-pointer ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-teal-50/60 text-slate-700 border-slate-200 hover:border-teal-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{slot}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
