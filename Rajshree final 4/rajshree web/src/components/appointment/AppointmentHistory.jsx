import React, { useState, useMemo, useCallback } from 'react';
import { AppointmentCard } from './AppointmentCard';
import { RescheduleModal } from './RescheduleModal';
import { Calendar, Search, AlertCircle, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import { Button } from '../common/Button';

export const AppointmentHistory = ({
  appointments = [],
  doctors = [],
  getAvailableSlots,
  onReschedule,
  onCancel
}) => {
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'upcoming', 'history', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForReschedule, setSelectedForReschedule] = useState(null);
  const [cancellationAlert, setCancellationAlert] = useState(null);

  // useMemo to efficiently filter and calculate appointments
  const filteredAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date + 'T00:00:00');

      // Tab filtering
      if (filterTab === 'upcoming') {
        const isUpcoming =
          aptDate >= today && (apt.status === 'Confirmed' || apt.status === 'Rescheduled');
        if (!isUpcoming) return false;
      } else if (filterTab === 'history') {
        const isHistory =
          aptDate < today || apt.status === 'Completed';
        if (!isHistory) return false;
      } else if (filterTab === 'cancelled') {
        if (apt.status !== 'Cancelled') return false;
      }

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          apt.doctorName.toLowerCase().includes(q) ||
          apt.doctorSpecialty.toLowerCase().includes(q) ||
          apt.id.toLowerCase().includes(q) ||
          apt.patientName.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [appointments, filterTab, searchQuery]);

  // Appointment counts via useMemo
  const counts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = appointments.filter((apt) => {
      const aptDate = new Date(apt.date + 'T00:00:00');
      return aptDate >= today && (apt.status === 'Confirmed' || apt.status === 'Rescheduled');
    }).length;

    const cancelled = appointments.filter((apt) => apt.status === 'Cancelled').length;
    const history = appointments.filter((apt) => {
      const aptDate = new Date(apt.date + 'T00:00:00');
      return aptDate < today || apt.status === 'Completed';
    }).length;

    return { all: appointments.length, upcoming, cancelled, history };
  }, [appointments]);

  // Cancel callback
  const handleCancel = useCallback(
    async (apt) => {
      const reason = window.prompt(
        `Are you sure you want to cancel appointment ${apt.id} with ${apt.doctorName}? Please specify a reason:`,
        'Personal schedule conflict'
      );
      if (reason) {
        await onCancel(apt.id, reason);
        setCancellationAlert(`Appointment ${apt.id} has been cancelled successfully.`);
        setTimeout(() => setCancellationAlert(null), 5000);
      }
    },
    [onCancel]
  );

  // Find doctor object for reschedule modal
  const activeDoctor = useMemo(() => {
    if (!selectedForReschedule) return null;
    return doctors.find((d) => d.id === selectedForReschedule.doctorId) || null;
  }, [doctors, selectedForReschedule]);

  return (
    <div className="space-y-6">
      {/* Cancellation alert message (Experiment 2 h: "Appointment cancelled") */}
      {cancellationAlert && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Appointment cancelled. Your OPD slot has been released back into hospital availability.</span>
          </div>
          <button
            type="button"
            onClick={() => setCancellationAlert(null)}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs and Search Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Bookings', count: counts.all },
            { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
            { id: 'history', label: 'Completed', count: counts.history },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled }
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-teal-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input inside appointments */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor, ID, or patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Appointment Cards list or Conditional Empty States (Experiment 2 h) */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {filterTab === 'upcoming'
              ? 'No upcoming appointments'
              : 'No appointments available'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterTab === 'upcoming'
              ? 'You do not have any confirmed OPD consultations scheduled for future dates.'
              : 'No appointment records matched your active filter or search keywords.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onReschedule={() => setSelectedForReschedule(apt)}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {selectedForReschedule && (
        <RescheduleModal
          isOpen={!!selectedForReschedule}
          onClose={() => setSelectedForReschedule(null)}
          appointment={selectedForReschedule}
          doctor={activeDoctor}
          getAvailableSlots={getAvailableSlots}
          onConfirmReschedule={onReschedule}
        />
      )}
    </div>
  );
};
