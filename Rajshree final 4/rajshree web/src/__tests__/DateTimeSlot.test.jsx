import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeSlot } from '../components/appointment/TimeSlot';

describe('Experiment 1 c: Test Date and Time-slot Selection Component', () => {
  const mockSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM'];

  it('renders available time slots with radiogroup and radio roles', () => {
    const handleSelect = vi.fn();
    render(
      <TimeSlot
        slots={mockSlots}
        selectedSlot="10:00 AM"
        onSelectSlot={handleSelect}
      />
    );

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toBeInTheDocument();

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);

    const selectedSlotBtn = screen.getByRole('radio', { name: /time slot 10:00 am/i });
    expect(selectedSlotBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('triggers onSelectSlot when clicking a slot', () => {
    const handleSelect = vi.fn();
    render(
      <TimeSlot
        slots={mockSlots}
        selectedSlot=""
        onSelectSlot={handleSelect}
      />
    );

    const slotBtn = screen.getByRole('radio', { name: /time slot 11:30 am/i });
    fireEvent.click(slotBtn);

    expect(handleSelect).toHaveBeenCalledWith('11:30 AM');
  });

  it('supports keyboard navigation via Enter and Space keys', () => {
    const handleSelect = vi.fn();
    render(
      <TimeSlot
        slots={mockSlots}
        selectedSlot=""
        onSelectSlot={handleSelect}
      />
    );

    const slotBtn = screen.getByRole('radio', { name: /time slot 02:00 pm/i });
    fireEvent.keyDown(slotBtn, { key: 'Enter', code: 'Enter' });

    expect(handleSelect).toHaveBeenCalledWith('02:00 PM');

    fireEvent.keyDown(slotBtn, { key: ' ', code: 'Space' });
    expect(handleSelect).toHaveBeenCalledWith('02:00 PM');
  });

  it('displays message when no time slots are available', () => {
    render(<TimeSlot slots={[]} selectedSlot="" onSelectSlot={vi.fn()} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/no time slots available for this doctor on the selected date/i)).toBeInTheDocument();
  });
});
