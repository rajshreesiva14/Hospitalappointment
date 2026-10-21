import React from 'react';
import { DoctorCard } from './DoctorCard';
import { AlertCircle, RotateCcw, UserX } from 'lucide-react';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';

export const DoctorList = ({
  doctors = [],
  isLoading = false,
  error = null,
  onRetry,
  onSelectDoctor,
  onResetFilters
}) => {
  if (isLoading) {
    return <Loading message="Loading hospital medical specialists..." />;
  }

  // Loading and error states handling
  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="bg-white rounded-3xl p-10 border border-rose-200/90 text-center space-y-4 shadow-xs"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800">Failed to Load Specialists</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {typeof error === 'string'
              ? error
              : 'Unable to communicate with the medical directory service. Please check your network and retry.'}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onRetry}
              icon={RotateCcw}
            >
              Retry Connection
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Experiment 2 h: Conditional rendering: "No doctors available"
  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <UserX className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800">No doctors available</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any specialist matching your current search criteria, specialty, or day filter.
          </p>
        </div>
        {onResetFilters && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              icon={RotateCcw}
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onSelectDoctor={onSelectDoctor}
        />
      ))}
    </div>
  );
};
