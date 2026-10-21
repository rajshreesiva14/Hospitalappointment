import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import { AppointmentBooking } from '../components/appointment/AppointmentBooking';
import { AppointmentCard } from '../components/appointment/AppointmentCard';
import { RescheduleModal } from '../components/appointment/RescheduleModal';

const mockDoctors = [
  {
    id: 101,
    name: 'Dr. Rajeshwar Sharma',
    specialty: 'Cardiology',
    consultationFee: 1200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
    room: 'Cardio Wing, OPD 301'
  }
];

const mockAppointment = {
  id: 'APT-2026-1001',
  doctorId: 101,
  doctorName: 'Dr. Rajeshwar Sharma',
  doctorSpecialty: 'Cardiology',
  date: '2026-10-25',
  timeSlot: '10:00 AM',
  duration: '30 mins',
  consultationFee: 1200,
  patientName: 'Sampath Kumar',
  patientEmail: 'rajshree.patient@health.org',
  patientPhone: '9876543210',
  status: 'Confirmed',
  room: 'Cardio Wing, OPD 301',
  paymentStatus: 'Paid'
};

describe('Experiment 1 d & Experiment 3: Test Appointment Booking and CRUD Components', () => {
  it('renders booking step 1 with doctor, date, and slots', () => {
    renderWithProviders(
      <AppointmentBooking
        doctors={mockDoctors}
        selectedDoctor={mockDoctors[0]}
        getAvailableSlots={() => ['09:00 AM', '10:00 AM']}
        onBookAppointment={vi.fn()}
      />
    );

    expect(screen.getByText(/Choose Specialist & OPD Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardio Wing, OPD 301/i)).toBeInTheDocument();
  });

  it('renders appointment card with status, time, doctor, and action buttons', () => {
    const handleReschedule = vi.fn();
    const handleCancel = vi.fn();

    renderWithProviders(
      <AppointmentCard
        appointment={mockAppointment}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />
    );

    expect(screen.getByText('APT-2026-1001')).toBeInTheDocument();
    expect(screen.getByText('Dr. Rajeshwar Sharma')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText(/10:00 AM/)).toBeInTheDocument();
  });

  it('triggers onReschedule and onCancel callbacks from appointment card', () => {
    const handleReschedule = vi.fn();
    const handleCancel = vi.fn();

    renderWithProviders(
      <AppointmentCard
        appointment={mockAppointment}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />
    );

    const rescheduleBtn = screen.getByRole('button', { name: /reschedule/i });
    fireEvent.click(rescheduleBtn);
    expect(handleReschedule).toHaveBeenCalledWith(mockAppointment);

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledWith(mockAppointment);
  });

  it('navigates through booking steps and confirms appointment booking', async () => {
    const handleBook = vi.fn().mockResolvedValue({
      id: 'APT-2026-9999',
      doctorName: 'Dr. Rajeshwar Sharma',
      room: 'Cardio Wing, OPD 301',
      date: '2026-10-25',
      timeSlot: '09:00 AM',
      patientName: 'Sampath Kumar',
      transactionId: 'TXN-123456'
    });

    renderWithProviders(
      <AppointmentBooking
        doctors={mockDoctors}
        selectedDoctor={mockDoctors[0]}
        getAvailableSlots={() => ['09:00 AM', '10:00 AM']}
        onBookAppointment={handleBook}
      />
    );

    // Step 1: Select slot and click Next
    const nextBtn1 = screen.getByRole('button', { name: /next: patient information/i });
    expect(nextBtn1).toBeInTheDocument();
    fireEvent.click(nextBtn1);

    // Step 2: Patient Form is displayed
    await waitFor(() => {
      expect(screen.getByText(/Step 2: Patient Registration Details/i)).toBeInTheDocument();
    });

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Patient Full Name/i), {
      target: { value: 'Sampath Kumar' }
    });
    fireEvent.change(screen.getByPlaceholderText(/patient@example\.com/i), {
      target: { value: 'sampath@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/10-digit number/i), {
      target: { value: '9876543210' }
    });
    fireEvent.change(screen.getByPlaceholderText(/describe symptoms/i), {
      target: { value: 'Chest discomfort after morning exercise' }
    });

    // Advance to Step 3
    const nextBtn2 = screen.getByRole('button', { name: /next: review & confirm/i });
    fireEvent.click(nextBtn2);

    // Step 3: Review & Summary is displayed
    await waitFor(() => {
      expect(screen.getByText(/Step 3: Consultation Summary & Review/i)).toBeInTheDocument();
    });

    // Click Confirm Booking
    const confirmBtn = screen.getByRole('button', { name: /confirm booking/i });
    fireEvent.click(confirmBtn);

    // Step 4: Booking confirmation is reached
    await waitFor(() => {
      expect(handleBook).toHaveBeenCalled();
      expect(screen.getByText(/Your OPD Appointment is Scheduled!/i)).toBeInTheDocument();
      expect(screen.getByText('APT-2026-9999')).toBeInTheDocument();
    });
  });

  it('renders RescheduleModal and confirms rescheduling', async () => {
    const handleConfirm = vi.fn().mockResolvedValue({ success: true });
    const handleClose = vi.fn();

    renderWithProviders(
      <RescheduleModal
        isOpen={true}
        onClose={handleClose}
        appointment={mockAppointment}
        doctor={mockDoctors[0]}
        getAvailableSlots={() => ['09:00 AM', '11:00 AM']}
        onConfirmReschedule={handleConfirm}
      />
    );

    expect(screen.getByText(/Reschedule Appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/APT-2026-1001/i)).toBeInTheDocument();

    // Select new date
    const dateInput = screen.getByLabelText(/select new date/i);
    fireEvent.change(dateInput, { target: { value: '2026-10-28' } });

    // Select slot
    await waitFor(() => {
      const slotRadio = screen.getByRole('radio', { name: /time slot 09:00 am/i });
      fireEvent.click(slotRadio);
    });

    const submitBtn = screen.getByRole('button', { name: /confirm reschedule/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalledWith('APT-2026-1001', '2026-10-28', '09:00 AM');
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('handles asynchronous doctor arrival and successfully confirms booking without null pointer or doctor selection error', async () => {
    const handleBook = vi.fn().mockResolvedValue({
      id: 'APT-2026-8888',
      doctorName: 'Dr. Rajeshwar Sharma',
      room: 'Cardio Wing, OPD 301',
      date: '2026-10-25',
      timeSlot: '09:00 AM',
      patientName: 'Priya Sharma',
      consultationFee: 1260
    });

    // Mount initially with empty doctors array (as happens before REST API returns)
    const { rerender } = renderWithProviders(
      <AppointmentBooking
        doctors={[]}
        selectedDoctor={null}
        getAvailableSlots={() => ['09:00 AM', '10:00 AM']}
        onBookAppointment={handleBook}
      />
    );

    // Now doctors arrive asynchronously from REST API
    rerender(
      <AppointmentBooking
        doctors={mockDoctors}
        selectedDoctor={null}
        getAvailableSlots={() => ['09:00 AM', '10:00 AM']}
        onBookAppointment={handleBook}
      />
    );

    // Verified: doctor is selected and Next button is active
    await waitFor(() => {
      expect(screen.getAllByText(/Dr\. Rajeshwar Sharma/i).length).toBeGreaterThan(0);
    });

    const nextBtn1 = screen.getByRole('button', { name: /next: patient information/i });
    expect(nextBtn1).not.toBeDisabled();
    fireEvent.click(nextBtn1);

    // Step 2: Patient Form
    await waitFor(() => {
      expect(screen.getByText(/Step 2: Patient Registration Details/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Patient Full Name/i), {
      target: { value: 'Priya Sharma' }
    });
    fireEvent.change(screen.getByPlaceholderText(/patient@example\.com/i), {
      target: { value: 'priya@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/10-digit number/i), {
      target: { value: '9876543210' }
    });
    fireEvent.change(screen.getByPlaceholderText(/describe symptoms/i), {
      target: { value: 'Routine cardiology follow-up and blood pressure check' }
    });

    const nextBtn2 = screen.getByRole('button', { name: /next: review & confirm/i });
    fireEvent.click(nextBtn2);

    // Step 3: Review
    await waitFor(() => {
      expect(screen.getByText(/Step 3: Consultation Summary & Review/i)).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole('button', { name: /confirm booking/i });
    fireEvent.click(confirmBtn);

    // Step 4: Successfully confirmed without throwing any error
    await waitFor(() => {
      expect(handleBook).toHaveBeenCalled();
      expect(screen.getByText(/Your OPD Appointment is Scheduled!/i)).toBeInTheDocument();
      expect(screen.getByText('APT-2026-8888')).toBeInTheDocument();
    });
  });
});
