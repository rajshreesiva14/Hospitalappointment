import React from 'react';
import { Filter, RotateCcw, Star, Calendar, IndianRupee, ArrowDownUp } from 'lucide-react';
import { SPECIALTIES } from '../../data/doctorsData';
import { Button } from '../common/Button';

const DAYS = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const FilterPanel = ({
  selectedSpecialty,
  onSpecialtyChange,
  selectedDay,
  onDayChange,
  maxFee,
  onMaxFeeChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  totalResults
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-6">
      {/* Top Filter header with result count and reset button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Filter Specialists</h3>
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-teal-600">{totalResults}</span> doctors available
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          aria-label="Reset all filters"
          className="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center gap-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded p-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Specialty Filter */}
      <div className="space-y-2">
        <label htmlFor="specialty-filter" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Medical Specialty
        </label>
        <select
          id="specialty-filter"
          value={selectedSpecialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition cursor-pointer"
        >
          {SPECIALTIES.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Day of Week */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>Available Day</span>
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by available day">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Filter by ${day}`}
                onClick={() => onDayChange(day)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day === 'All Days' ? 'Any' : day.substring(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Consultation Fee Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-teal-600" /> Max Fee
          </span>
          <span className="text-teal-700 font-extrabold text-sm">₹{maxFee}</span>
        </div>
        <input
          type="range"
          min="500"
          max="1500"
          step="50"
          value={maxFee}
          aria-label="Maximum consultation fee"
          aria-valuemin="500"
          aria-valuemax="1500"
          aria-valuenow={maxFee}
          onChange={(e) => onMaxFeeChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>₹500</span>
          <span>₹1000</span>
          <span>₹1500</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Minimum Rating</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Filter by minimum rating">
          {[
            { label: 'All', value: 0 },
            { label: '4.5+ ⭐', value: 4.5 },
            { label: '4.9+ ⭐', value: 4.9 }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={minRating === item.value}
              aria-label={`Minimum rating ${item.label}`}
              onClick={() => onMinRatingChange(item.value)}
              className={`text-xs py-1.5 rounded-lg font-medium transition text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                minRating === item.value
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <ArrowDownUp className="w-3.5 h-3.5 text-teal-600" />
          <span>Sort By</span>
        </label>
        <select
          value={sortBy}
          aria-label="Sort doctors by"
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
        >
          <option value="recommended">Recommended / Featured</option>
          <option value="rating-high">Highest Rated</option>
          <option value="fee-low">Fee: Low to High</option>
          <option value="fee-high">Fee: High to Low</option>
          <option value="experience-high">Experience: Most Senior</option>
        </select>
      </div>
    </div>
  );
};
