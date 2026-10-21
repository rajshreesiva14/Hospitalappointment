import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './testUtils';
import { Input } from '../components/common/Input';
import { LoginPage } from '../pages/LoginPage';
import manifest from '../../public/manifest.json';
import { registerServiceWorker } from '../registerServiceWorker';

describe('PWA Features, Accessibility, and Secure Input Handling', () => {
  it('validates web app manifest for PWA installation readiness', () => {
    expect(manifest.short_name).toBe('RajshreeCare');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#0d9488');
    expect(manifest.background_color).toBe('#042f2e');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);

    // Verify icons point to valid svg/png assets
    const validIcon = manifest.icons.find((i) => i.src === '/favicon.svg');
    expect(validIcon).toBeDefined();
    expect(validIcon.type).toBe('image/svg+xml');
  });

  it('listens for online and offline network events in service worker registration', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    registerServiceWorker();

    // Trigger offline event
    window.dispatchEvent(new Event('offline'));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'rajshree:connectivity'
      })
    );

    // Trigger online event
    window.dispatchEvent(new Event('online'));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'rajshree:connectivity'
      })
    );

    dispatchSpy.mockRestore();
  });

  it('renders Input with aria-invalid and aria-describedby linked to error alert', () => {
    render(
      <Input
        label="Patient Phone"
        id="test-phone"
        name="testPhone"
        value="123"
        onChange={vi.fn()}
        error="Invalid 10-digit mobile number"
        hint="Enter 10 numeric digits"
      />
    );

    const input = screen.getByLabelText(/Patient Phone/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-phone-hint test-phone-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'test-phone-error');
    expect(errorAlert).toHaveTextContent('Invalid 10-digit mobile number');
  });

  it('renders password input with secure masking and toggle visibility action', () => {
    renderWithProviders(<LoginPage />);

    // By default password is of type password (masked)
    const passwordInput = screen.getByLabelText(/^Account Password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');

    // Toggle button should have accessible label
    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click toggle to reveal password
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to mask password
    const hideBtn = screen.getByRole('button', { name: /hide password/i });
    fireEvent.click(hideBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('enforces autoComplete="username" on identifier input for secure browser autofill', () => {
    renderWithProviders(<LoginPage />);

    const identifierInput = screen.getByLabelText(/Email Address or Patient ID/i);
    expect(identifierInput).toHaveAttribute('autoComplete', 'username');
  });
});
