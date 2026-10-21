import React from 'react';
import { useHospital } from '../context/AppointmentContext';
import { AppointmentBooking } from '../components/appointment/AppointmentBooking';

export const BookAppointmentPage = () => {
  const { doctors, selectedDoctor, getAvailableSlots, bookAppointment } = useHospital();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 m-0">
          Book Hospital OPD Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Instant digital appointment reservation with live doctor availability and secure cashless confirmation.
        </p>
      </div>

      <AppointmentBooking
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        getAvailableSlots={getAvailableSlots}
        onBookAppointment={bookAppointment}
      />
    </div>
  );
};
