import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import { SearchBar } from '../components/doctor/SearchBar';
import { FilterPanel } from '../components/doctor/FilterPanel';
import { DoctorList } from '../components/doctor/DoctorList';

describe('Experiment 1 b: Test Doctor Search, Specialty Filtering & List', () => {
  it('updates search query in SearchBar when typing', () => {
    const handleSearchChange = vi.fn();
    renderWithProviders(
      <SearchBar
        searchQuery=""
        onSearchChange={handleSearchChange}
        placeholder="Search doctor..."
      />
    );

    const input = screen.getByPlaceholderText('Search doctor...');
    fireEvent.change(input, { target: { value: 'Sharma' } });

    expect(handleSearchChange).toHaveBeenCalledWith('Sharma');
  });

  it('clears search query and triggers callback when clear button is clicked', () => {
    const handleSearchChange = vi.fn();
    renderWithProviders(
      <SearchBar
        searchQuery="Cardiology"
        onSearchChange={handleSearchChange}
        placeholder="Search doctor..."
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear search query/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);

    expect(handleSearchChange).toHaveBeenCalledWith('');
  });

  it('triggers specialty change when selecting a specialty option in FilterPanel', () => {
    const handleSpecialtyChange = vi.fn();
    renderWithProviders(
      <FilterPanel
        selectedSpecialty="All Specialties"
        onSpecialtyChange={handleSpecialtyChange}
        selectedDay="All Days"
        onDayChange={vi.fn()}
        maxFee={1500}
        onMaxFeeChange={vi.fn()}
        minRating={0}
        onMinRatingChange={vi.fn()}
        sortBy="recommended"
        onSortByChange={vi.fn()}
        onResetFilters={vi.fn()}
        totalResults={6}
      />
    );

    // Select Specialty dropdown
    const specialtySelect = screen.getByLabelText(/medical specialty/i);
    fireEvent.change(specialtySelect, { target: { value: 'Cardiology' } });

    expect(handleSpecialtyChange).toHaveBeenCalledWith('Cardiology');
  });

  it('renders "No doctors available" and Reset button when list is empty', () => {
    const handleReset = vi.fn();
    renderWithProviders(
      <DoctorList
        doctors={[]}
        isLoading={false}
        onSelectDoctor={vi.fn()}
        onResetFilters={handleReset}
      />
    );

    expect(screen.getByText('No doctors available')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find any specialist matching your current search/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /reset all filters/i });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalled();
  });
});
