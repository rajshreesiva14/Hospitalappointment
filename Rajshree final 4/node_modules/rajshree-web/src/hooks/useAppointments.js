import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAppointmentsThunk,
  fetchAppointmentHistoryThunk,
  fetchAppointmentByIdThunk,
  bookAppointmentThunk,
  rescheduleAppointmentThunk,
  cancelAppointmentThunk,
  setSelectedDoctor,
  setAppointmentDate,
  setSelectedTimeSlot,
  setPatientDetails,
  setBookingStatus,
  setReminderNotification,
  clearAppointmentDraft
} from '../store/slices/appointmentSlice';
import { fetchDoctorAvailabilityThunk } from '../store/slices/doctorSlice';
import { AUTH_TOKEN_KEY } from '../services/apiClient';

export const useAppointments = () => {
  const dispatch = useDispatch();
  const {
    appointments,
    history,
    selectedDoctor,
    appointmentDate,
    selectedTimeSlot,
    patientDetails,
    bookingStatus,
    loading: isLoading,
    error,
    lastBookedAppointment,
    reminderNotification,
    monitoredActions
  } = useSelector((state) => state.appointment);

  const { availabilityCache, pendingAvailability = {} } = useSelector((state) => state.doctors);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Retrieve appointments using GET when user is authenticated or has active session token
  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem(AUTH_TOKEN_KEY);
    if (isAuthenticated || hasToken) {
      dispatch(fetchAppointmentsThunk());
      dispatch(fetchAppointmentHistoryThunk());
    }
  }, [dispatch, isAuthenticated]);

  // Appointment reminder check
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingToday = appointments.find(
      (apt) => apt.date === todayStr && (apt.status === 'Confirmed' || apt.status === 'Rescheduled')
    );
    if (upcomingToday) {
      dispatch(
        setReminderNotification({
          message: `Reminder: You have an appointment with ${upcomingToday.doctorName} today at ${upcomingToday.timeSlot} (${upcomingToday.room || 'OPD Desk'})`,
          appointmentId: upcomingToday.id
        })
      );
    }
  }, [appointments, dispatch]);

  const appointmentCount = useMemo(() => appointments.length, [appointments]);

  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date + 'T00:00:00');
        return aptDate >= today && (apt.status === 'Confirmed' || apt.status === 'Rescheduled');
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments]);

  const appointmentHistory = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date + 'T00:00:00');
        return aptDate < today || apt.status === 'Completed' || apt.status === 'Cancelled';
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments]);

  // Retrieve available dates and time slots using API requests & cache (Experiment 1 c & Experiment 2 e)
  const getAvailableSlots = useCallback(
    (doctor, date) => {
      if (!doctor || !doctor.availableTimeSlots) return [];
      if (!date) return doctor.availableTimeSlots;

      const cacheKey = `${doctor.id}_${date}`;
      if (availabilityCache[cacheKey]) {
        return availabilityCache[cacheKey];
      }

      // Dispatch async availability fetch only if not currently pending/in-flight
      if (!pendingAvailability[cacheKey]) {
        dispatch(fetchDoctorAvailabilityThunk({ doctorId: doctor.id, date }));
      }

      // Compute immediate fallback from locally available appointments
      const bookedSlots = appointments
        .filter(
          (apt) =>
            apt.doctorId === doctor.id &&
            apt.date === date &&
            (apt.status === 'Confirmed' || apt.status === 'Rescheduled')
        )
        .map((apt) => apt.timeSlot);

      return doctor.availableTimeSlots.filter((slot) => !bookedSlots.includes(slot));
    },
    [appointments, availabilityCache, pendingAvailability, dispatch]
  );

  // Operations
  const handleSelectDoctor = useCallback(
    (doctor) => dispatch(setSelectedDoctor(doctor)),
    [dispatch]
  );

  const handleSelectTimeSlot = useCallback(
    (slot) => dispatch(setSelectedTimeSlot(slot)),
    [dispatch]
  );

  const handleSetAppointmentDate = useCallback(
    (date) => dispatch(setAppointmentDate(date)),
    [dispatch]
  );

  const handleSetPatientDetails = useCallback(
    (details) => dispatch(setPatientDetails(details)),
    [dispatch]
  );

  const handleSetBookingStatus = useCallback(
    (status) => dispatch(setBookingStatus(status)),
    [dispatch]
  );

  const handleClearAppointment = useCallback(
    () => dispatch(clearAppointmentDraft()),
    [dispatch]
  );

  // Experiment 3 b: Create an appointment using POST
  const bookAppointment = useCallback(
    async (bookingPayload) => {
      const action = await dispatch(bookAppointmentThunk(bookingPayload));
      if (bookAppointmentThunk.fulfilled.match(action)) {
        return action.payload;
      } else {
        throw new Error(action.payload || 'Booking failed');
      }
    },
    [dispatch]
  );

  // Experiment 3 c: Reschedule an appointment using PUT/PATCH
  const rescheduleAppointment = useCallback(
    async (appointmentId, newDate, newSlot) => {
      const action = await dispatch(
        rescheduleAppointmentThunk({
          appointmentId,
          date: newDate,
          timeSlot: newSlot
        })
      );
      if (rescheduleAppointmentThunk.fulfilled.match(action)) {
        return action.payload;
      } else {
        throw new Error(action.payload || 'Rescheduling failed');
      }
    },
    [dispatch]
  );

  // Experiment 3 d: Cancel an appointment using DELETE
  const cancelAppointment = useCallback(
    async (appointmentId, reason = 'Cancelled by user') => {
      const action = await dispatch(
        cancelAppointmentThunk({
          appointmentId,
          reason
        })
      );
      if (cancelAppointmentThunk.fulfilled.match(action)) {
        return action.payload;
      } else {
        throw new Error(action.payload || 'Cancellation failed');
      }
    },
    [dispatch]
  );

  const getAppointmentById = useCallback(
    (id) => {
      if (!id) return null;
      const targetId = String(id).trim().toLowerCase();
      return (
        appointments.find((apt) => String(apt.id).trim().toLowerCase() === targetId) ||
        history.find((apt) => String(apt.id).trim().toLowerCase() === targetId) ||
        null
      );
    },
    [appointments, history]
  );

  const fetchAppointmentById = useCallback(
    async (id) => {
      if (!id) return null;
      const action = await dispatch(fetchAppointmentByIdThunk(id));
      if (fetchAppointmentByIdThunk.fulfilled.match(action)) {
        return action.payload?.data || action.payload;
      }
      return null;
    },
    [dispatch]
  );

  return {
    appointments,
    appointmentCount,
    upcomingAppointments,
    appointmentHistory,
    selectedDoctor,
    setSelectedDoctor: handleSelectDoctor,
    selectDoctor: handleSelectDoctor,
    appointmentDate,
    setAppointmentDate: handleSetAppointmentDate,
    selectedTimeSlot,
    setSelectedTimeSlot: handleSelectTimeSlot,
    selectTimeSlot: handleSelectTimeSlot,
    patientDetails,
    setPatientDetails: handleSetPatientDetails,
    bookingStatus,
    setBookingStatus: handleSetBookingStatus,
    lastBookedAppointment,
    reminderNotification,
    setReminderNotification: (notif) => dispatch(setReminderNotification(notif)),
    getAvailableSlots,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    clearAppointment: handleClearAppointment,
    getAppointmentById,
    fetchAppointmentById,
    isLoading,
    error,
    monitoredActions
  };
};
