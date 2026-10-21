import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, Target } from 'lucide-react';

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search doctor by name, specialty (e.g. 'Cardio', 'Psychology'), or symptoms...",
  autoFocus = true
}) => {
  // useRef hook to reference input DOM element directly
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);

  // Demonstrate useRef: automatically focus the search field on mount
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  // Demonstrate DOM element referencing with useRef
  const handleFocusClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      // Briefly animate or highlight the DOM element
      searchInputRef.current.classList.add('ring-4', 'ring-teal-400');
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.classList.remove('ring-4', 'ring-teal-400');
        }
      }, 700);
    }
  };

  const handleClear = () => {
    onSearchChange('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="relative flex items-center">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-600">
          <Search className="h-5 w-5" />
        </div>

        {/* Controlled input element referenced by useRef */}
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && searchQuery) {
              handleClear();
            }
          }}
          placeholder={placeholder}
          aria-label="Search doctors by name, specialty, or condition"
          className="w-full pl-12 pr-28 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-sm md:text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />

        {/* Clear & Ref Focus action buttons */}
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search query"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Demonstration button for useRef DOM referencing */}
          <button
            type="button"
            onClick={handleFocusClick}
            aria-label="Focus search input"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Focus input via useRef DOM reference"
          >
            <Target className="w-3 h-3 text-teal-600" />
            <span>Ref Focus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
