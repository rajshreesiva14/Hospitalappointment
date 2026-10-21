import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import { AppointmentDetailPage } from '../pages/AppointmentDetailPage';
import { Routes, Route } from 'react-router-dom';

const mockAppointment = {
  id: 'APT-2026-1001',
  doctorId: 101,
  doctorName: 'Dr. Rajeshwar Sharma',
  doctorSpecialty: 'Cardiology',
  room: 'Cardio Wing, OPD 301',
  date: '2026-10-25',
  timeSlot: '10:00 AM',
  duration: '30 mins',
  consultationFee: 1200,
  patientName: 'Sampath Kumar',
  patientEmail: 'rajshree.patient@health.org',
  patientPhone: '9876543210',
  patientAge: 32,
  patientGender: 'Male',
  symptoms: 'Mild chest discomfort after exercise',
  status: 'Confirmed',
  paymentStatus: 'Paid',
  paymentMethod: 'UPI',
  transactionId: 'TXN-882194'
};

describe('Appointment Consultation Slip Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the complete OPD consultation slip with doctor and patient details without errors', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    renderWithProviders(
      <Routes>
        <Route path="/appointment/:id" element={<AppointmentDetailPage />} />
      </Routes>,
      {
        route: '/appointment/APT-2026-1001'
      }
    );

    // Verify slip header & hospital branding
    await waitFor(() => {
      expect(
        screen.getByText(/RAJSHREE MULTISPECIALITY HOSPITAL/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Digital Outpatient Department \(OPD\) Consultation Slip/i)
      ).toBeInTheDocument();
    });

    // Verify appointment ID & status badge
    expect(screen.getByText('APT-2026-1001')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();

    // Verify doctor information
    expect(screen.getByText('Dr. Rajeshwar Sharma')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText(/Cardio Wing, OPD 301/i)).toBeInTheDocument();

    // Verify patient information
    expect(screen.getByText('Sampath Kumar')).toBeInTheDocument();
    expect(screen.getByText('9876543210')).toBeInTheDocument();
    expect(screen.getByText('rajshree.patient@health.org')).toBeInTheDocument();
    expect(screen.getByText(/32 Years \/ Male/i)).toBeInTheDocument();

    // Verify fee & payment details
    expect(screen.getByText('₹1200')).toBeInTheDocument();
    expect(screen.getByText(/TXN-/i)).toBeInTheDocument();

    // Verify Print Slip action
    const printBtn = screen.getByRole('button', { name: /print slip/i });
    expect(printBtn).toBeInTheDocument();
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalled();

    printSpy.mockRestore();
  });

  it('renders "Appointment Record Not Found" gracefully when booking id does not exist', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/appointment/:id" element={<AppointmentDetailPage />} />
      </Routes>,
      {
        route: '/appointment/APT-NON-EXISTENT-9999'
      }
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Appointment Record Not Found/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/could not locate any booking with ID #APT-NON-EXISTENT-9999/i)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: /back to appointments/i })
    ).toBeInTheDocument();
  });
});
