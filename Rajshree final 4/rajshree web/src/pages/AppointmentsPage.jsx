import React from 'react';
import { useHospital } from '../context/AppointmentContext';
import { AppointmentHistory } from '../components/appointment/AppointmentHistory';
import { Bell, Calendar, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const AppointmentsPage = () => {
  const navigate = useNavigate();
  const {
    appointments,
    doctors,
    getAvailableSlots,
    rescheduleAppointment,
    cancelAppointment,
    reminderNotification,
    setReminderNotification
  } = useHospital();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 m-0">
            My Hospital Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed consultations, reschedule timing, or cancel bookings easily.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/book-appointment')}
          icon={Plus}
        >
          Book New Consultation
        </Button>
      </div>

      {/* Reminder Notification Banner (useEffect reminder from Experiment 2 g) */}
      {reminderNotification && (
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-100">
                Scheduled Appointment Reminder
              </p>
              <p className="text-xs sm:text-sm font-semibold mt-0.5">
                {reminderNotification.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReminderNotification(null)}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl font-bold transition ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Appointment History List */}
      <AppointmentHistory
        appointments={appointments}
        doctors={doctors}
        getAvailableSlots={getAvailableSlots}
        onReschedule={rescheduleAppointment}
        onCancel={cancelAppointment}
      />
    </div>
  );
};
