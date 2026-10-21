import React from 'react';
import { useHospital } from '../../context/AppointmentContext';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';
import { History, Calendar } from 'lucide-react';

export const PatientHistoryPage = () => {
  const { appointmentHistory } = useHospital();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Past Consultations & Medical History</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Archived record of completed consultations and past doctor visits.
        </p>
      </div>

      {appointmentHistory.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No appointments history</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not have any past completed or cancelled appointments on record.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointmentHistory.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
