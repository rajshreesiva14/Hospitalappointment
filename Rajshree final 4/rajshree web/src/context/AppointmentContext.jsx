import React, { createContext, useContext } from 'react';
import { useDoctors } from '../hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  const doctorOps = useDoctors();
  const appointmentOps = useAppointments();

  const value = {
    // Doctor related state & operations (Experiment 1)
    doctors: doctorOps.doctors,
    filteredDoctors: doctorOps.filteredDoctors,
    availableDoctorsCount: doctorOps.availableDoctorsCount,
    searchQuery: doctorOps.searchQuery,
    setSearchQuery: doctorOps.setSearchQuery,
    selectedSpecialty: doctorOps.selectedSpecialty,
    setSelectedSpecialty: doctorOps.setSelectedSpecialty,
    selectedDay: doctorOps.selectedDay,
    setSelectedDay: doctorOps.setSelectedDay,
    maxFee: doctorOps.maxFee,
    setMaxFee: doctorOps.setMaxFee,
    minRating: doctorOps.minRating,
    setMinRating: doctorOps.setMinRating,
    sortBy: doctorOps.sortBy,
    setSortBy: doctorOps.setSortBy,
    resetFilters: doctorOps.resetFilters,
    getDoctorById: doctorOps.getDoctorById,
    addDoctor: doctorOps.addDoctor,
    updateDoctor: doctorOps.updateDoctor,
    isDoctorLoading: doctorOps.isLoading,
    doctorError: doctorOps.error,

    // Appointment related state & operations (Experiment 2 & 3)
    appointments: appointmentOps.appointments,
    appointmentCount: appointmentOps.appointmentCount,
    upcomingAppointments: appointmentOps.upcomingAppointments,
    appointmentHistory: appointmentOps.appointmentHistory,
    selectedDoctor: appointmentOps.selectedDoctor,
    setSelectedDoctor: appointmentOps.setSelectedDoctor,
    selectDoctor: appointmentOps.selectDoctor,
    appointmentDate: appointmentOps.appointmentDate,
    setAppointmentDate: appointmentOps.setAppointmentDate,
    selectedTimeSlot: appointmentOps.selectedTimeSlot,
    setSelectedTimeSlot: appointmentOps.setSelectedTimeSlot,
    selectTimeSlot: appointmentOps.selectTimeSlot,
    patientDetails: appointmentOps.patientDetails,
    setPatientDetails: appointmentOps.setPatientDetails,
    bookingStatus: appointmentOps.bookingStatus,
    setBookingStatus: appointmentOps.setBookingStatus,
    lastBookedAppointment: appointmentOps.lastBookedAppointment,
    setLastBookedAppointment: appointmentOps.setLastBookedAppointment,
    reminderNotification: appointmentOps.reminderNotification,
    setReminderNotification: appointmentOps.setReminderNotification,
    getAvailableSlots: appointmentOps.getAvailableSlots,
    bookAppointment: appointmentOps.bookAppointment,
    rescheduleAppointment: appointmentOps.rescheduleAppointment,
    cancelAppointment: appointmentOps.cancelAppointment,
    clearAppointment: appointmentOps.clearAppointment,
    getAppointmentById: appointmentOps.getAppointmentById,
    fetchAppointmentById: appointmentOps.fetchAppointmentById,
    isAppointmentLoading: appointmentOps.isLoading,
    appointmentError: appointmentOps.error,
    monitoredActions: appointmentOps.monitoredActions
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useHospital must be used within an AppointmentProvider');
  }
  return context;
};
