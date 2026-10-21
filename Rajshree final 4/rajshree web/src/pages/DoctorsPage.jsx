import React from 'react';
import { useDispatch } from 'react-redux';
import { useHospital } from '../context/AppointmentContext';
import { SearchBar } from '../components/doctor/SearchBar';
import { FilterPanel } from '../components/doctor/FilterPanel';
import { DoctorList } from '../components/doctor/DoctorList';
import { Stethoscope, ShieldCheck } from 'lucide-react';
import { fetchDoctorsThunk } from '../store/slices/doctorSlice';

export const DoctorsPage = () => {
  const dispatch = useDispatch();
  const {
    filteredDoctors,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedDay,
    setSelectedDay,
    maxFee,
    setMaxFee,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    resetFilters,
    selectDoctor,
    isDoctorLoading,
    doctorError
  } = useHospital();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Hospital Medical Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 m-0">
              Find & Consult Specialist Doctors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search by name, clinical specialty, or symptoms. Book instant OPD visits or check consultation timings.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>All doctors verified & licensed by NMC</span>
          </div>
        </div>

        {/* Search bar with auto-focus via useRef and DOM reference button */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          autoFocus={true}
          placeholder="Search by doctor name (e.g. 'Sharma'), specialty ('Psychology', 'Cardiology'), or medical condition..."
        />
      </div>

      {/* Main Content Layout: Filters on left, Doctors on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Panel */}
        <div className="lg:col-span-1 lg:sticky lg:top-28">
          <FilterPanel
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            maxFee={maxFee}
            onMaxFeeChange={setMaxFee}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onResetFilters={resetFilters}
            totalResults={filteredDoctors.length}
          />
        </div>

        {/* Right Doctor List */}
        <div className="lg:col-span-3 space-y-4">
          <DoctorList
            doctors={filteredDoctors}
            isLoading={isDoctorLoading}
            error={doctorError}
            onRetry={() => dispatch(fetchDoctorsThunk({ forceRefresh: true }))}
            onSelectDoctor={selectDoctor}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};
