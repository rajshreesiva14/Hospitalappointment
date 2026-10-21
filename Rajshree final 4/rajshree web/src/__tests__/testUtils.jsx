import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createAppStore } from '../store';
import { AuthProvider } from '../context/AuthContext';
import { AppointmentProvider } from '../context/AppointmentContext';

/**
 * Custom render helper that wraps components with an isolated Redux Provider,
 * AuthProvider, AppointmentProvider, and MemoryRouter.
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    customStore,
    route = '/',
    ...renderOptions
  } = {}
) {
  const activeStore = customStore || createAppStore(preloadedState);

  function Wrapper({ children }) {
    return (
      <Provider store={activeStore}>
        <AuthProvider>
          <AppointmentProvider>
            <MemoryRouter initialEntries={[route]}>
              {children}
            </MemoryRouter>
          </AppointmentProvider>
        </AuthProvider>
      </Provider>
    );
  }

  return {
    store: activeStore,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
}
