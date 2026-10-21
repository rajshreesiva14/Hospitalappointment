import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TimeSlot } from './TimeSlot';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { validateAppointmentDate } from '../../utils/validators';

export const RescheduleModal = ({
  isOpen,
  onClose,
  appointment,
  doctor,
  getAvailableSlots,
  onConfirmReschedule
}) => {
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [dateError, setDateError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form when appointment changes
  useEffect(() => {
    if (appointment) {
      setNewDate('');
      setNewSlot('');
      setDateError('');
      setAvailableSlots([]);
    }
  }, [appointment, isOpen]);

  // Update available time slots when date changes (Experiment 1 c requirement)
  useEffect(() => {
    if (newDate && doctor) {
      const err = validateAppointmentDate(newDate, doctor.availableDays);
      setDateError(err);

      if (!err && getAvailableSlots) {
        const slots = getAvailableSlots(doctor, newDate);
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    } else {
      setAvailableSlots([]);
    }
    setNewSlot('');
  }, [newDate, doctor, getAvailableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate) {
      setDateError('Please choose a new appointment date.');
      return;
    }
    const err = validateAppointmentDate(newDate, doctor?.availableDays);
    if (err) {
      setDateError(err);
      return;
    }
    if (!newSlot) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirmReschedule(appointment.id, newDate, newSlot);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Appointment"
      subtitle={`Appointment ID: ${appointment.id} with ${appointment.doctorName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current appointment info */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">Currently Scheduled:</p>
          <div className="flex items-center gap-3 text-slate-700">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" /> {appointment.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-600" /> {appointment.timeSlot}
            </span>
          </div>
        </div>

        {/* New Date Input */}
        <div className="space-y-1 text-left">
          <label htmlFor="reschedule-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Select New Date
          </label>
          <input
            id="reschedule-date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          {dateError && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{dateError}</span>
            </p>
          )}
          {doctor && (
            <p className="text-[11px] text-slate-500 mt-0.5">
              Doctor available days: <strong>{doctor.availableDays.join(', ')}</strong>
            </p>
          )}
        </div>

        {/* Time slots for selected date */}
        {newDate && !dateError && (
          <div className="space-y-2 text-left">
            <TimeSlot
              slots={availableSlots}
              selectedSlot={newSlot}
              onSelectSlot={(slot) => setNewSlot(slot)}
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            disabled={!newDate || !newSlot || !!dateError}
          >
            Confirm Reschedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};
