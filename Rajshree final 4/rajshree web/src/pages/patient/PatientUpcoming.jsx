import React from 'react';
import { useHospital } from '../../context/AppointmentContext';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';
import { Clock, Calendar, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const PatientUpcoming = () => {
  const navigate = useNavigate();
  const { upcomingAppointments, rescheduleAppointment, cancelAppointment } = useHospital();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Upcoming Consultations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            You have <strong className="text-teal-700">{upcomingAppointments.length}</strong> upcoming doctor appointments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/book-appointment')}
          icon={Plus}
        >
          Book New
        </Button>
      </div>

      {/* Experiment 2 h: Conditional rendering: "No upcoming appointments" */}
      {upcomingAppointments.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No upcoming appointments</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no scheduled OPD sessions. You can book an appointment with any available specialist doctor.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/book-appointment')}
              icon={Calendar}
            >
              Book an OPD Appointment
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onReschedule={() => navigate('/appointments')}
              onCancel={() => navigate('/appointments')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
