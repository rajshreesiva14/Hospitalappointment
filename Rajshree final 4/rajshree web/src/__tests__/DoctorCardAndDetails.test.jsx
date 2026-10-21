import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import { DoctorCard } from '../components/doctor/DoctorCard';
import { DoctorProfile } from '../components/doctor/DoctorProfile';

const mockDoctor = {
  id: 101,
  name: 'Dr. Rajeshwar Sharma',
  specialty: 'Cardiology',
  department: 'Institute of Cardiac Sciences',
  qualification: 'MBBS, MD (Medicine), DM (Cardiology)',
  experience: 18,
  rating: 4.9,
  reviewsCount: 320,
  consultationFee: 1200,
  availableDays: ['Monday', 'Tuesday', 'Wednesday'],
  availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
  room: 'Cardio Wing, OPD 301',
  languages: ['English', 'Hindi'],
  image: '',
  about: 'Senior interventional cardiologist with 18 years of clinical experience in cardiac care.',
  portfolio: {
    bio: 'Chief Interventional Cardiologist at Rajshree Hospital.',
    clinicalExpertise: ['Coronary Angioplasty', 'Cardiac Stress Testing'],
    education: ['DM Cardiology - AIIMS'],
    awards: ['National Healthcare Excellence Award']
  }
};

describe('Experiment 1 a & d: Test Doctor Cards and Doctor Details Components', () => {
  it('renders doctor card with name, specialty, rating, experience, and consultation fee', () => {
    const handleSelect = vi.fn();
    renderWithProviders(<DoctorCard doctor={mockDoctor} onSelectDoctor={handleSelect} />);

    expect(screen.getByText('Dr. Rajeshwar Sharma')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText(/18 yrs/)).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText(/320 patient reviews/)).toBeInTheDocument();
  });

  it('triggers onSelectDoctor when clicking Book button on doctor card', () => {
    const handleSelect = vi.fn();
    renderWithProviders(<DoctorCard doctor={mockDoctor} onSelectDoctor={handleSelect} />);

    const bookBtn = screen.getByRole('button', { name: /^book$/i });
    fireEvent.click(bookBtn);

    expect(handleSelect).toHaveBeenCalledWith(mockDoctor);
  });

  it('renders detailed doctor profile with clinical expertise, bio, and qualifications', () => {
    const handleSelect = vi.fn();
    renderWithProviders(<DoctorProfile doctor={mockDoctor} onSelectDoctor={handleSelect} />);

    expect(screen.getByText('Dr. Rajeshwar Sharma')).toBeInTheDocument();
    expect(screen.getByText('Institute of Cardiac Sciences')).toBeInTheDocument();
    expect(screen.getByText(/Senior interventional cardiologist with 18 years/)).toBeInTheDocument();
    expect(screen.getByText('Coronary Angioplasty')).toBeInTheDocument();
    expect(screen.getByText('National Healthcare Excellence Award')).toBeInTheDocument();
  });

  it('renders doctor card with image and accessible attributes when image is provided', () => {
    const doctorWithImage = {
      ...mockDoctor,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300'
    };

    renderWithProviders(<DoctorCard doctor={doctorWithImage} onSelectDoctor={vi.fn()} />);

    const img = screen.getByRole('img', { name: /portrait of dr\. rajeshwar sharma/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('renders accessible aria-label on doctor profile link', () => {
    renderWithProviders(<DoctorCard doctor={mockDoctor} onSelectDoctor={vi.fn()} />);

    const profileLink = screen.getByRole('link', { name: /view profile and portfolio of dr\. rajeshwar sharma/i });
    expect(profileLink).toBeInTheDocument();
  });
});
