import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from '../components/common/Loading';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { DoctorList } from '../components/doctor/DoctorList';
import { renderWithProviders } from './testUtils';

// Problematic component that intentionally throws an error
const ProblemChild = () => {
  throw new Error('Critical database connection fault');
};

describe('Experiment 1 e & f: Test Loading and Error States', () => {
  it('renders Loading component with custom message', () => {
    render(<Loading message="Connecting to Hospital REST API..." size="md" />);

    expect(screen.getByText('Connecting to Hospital REST API...')).toBeInTheDocument();
  });

  it('renders DoctorList in loading state with message', () => {
    renderWithProviders(<DoctorList doctors={[]} isLoading={true} />);

    expect(screen.getByText(/loading hospital medical specialists/i)).toBeInTheDocument();
  });

  it('renders DoctorList in error state with alert role, message, and retry button', () => {
    const handleRetry = vi.fn();
    renderWithProviders(
      <DoctorList
        doctors={[]}
        isLoading={false}
        error="Network timeout while connecting to hospital medical registry"
        onRetry={handleRetry}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to Load Specialists')).toBeInTheDocument();
    expect(
      screen.getByText('Network timeout while connecting to hospital medical registry')
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry connection/i });
    expect(retryBtn).toBeInTheDocument();
    retryBtn.click();
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('catches render errors and displays fallback UI in ErrorBoundary', () => {
    // Suppress console.error during deliberate error test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Critical database connection fault/)).toBeInTheDocument();

    spy.mockRestore();
  });
});
