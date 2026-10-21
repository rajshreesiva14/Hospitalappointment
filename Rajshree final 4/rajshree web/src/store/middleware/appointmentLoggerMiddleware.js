/**
 * Experiment 2 d: Middleware to monitor appointment actions
 * Intercepts booking, rescheduling, and cancellation actions.
 * Logs structured metadata and dispatches monitored audit entries.
 */

export const APPOINTMENT_AUDIT_ACTION = 'appointment/recordMonitoredAction';

export const appointmentLoggerMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Monitor appointment lifecycle actions
  const monitoredTypes = [
    'appointment/bookAppointment/pending',
    'appointment/bookAppointment/fulfilled',
    'appointment/bookAppointment/rejected',
    'appointment/rescheduleAppointment/pending',
    'appointment/rescheduleAppointment/fulfilled',
    'appointment/rescheduleAppointment/rejected',
    'appointment/cancelAppointment/pending',
    'appointment/cancelAppointment/fulfilled',
    'appointment/cancelAppointment/rejected'
  ];

  if (monitoredTypes.includes(action.type)) {
    const timestamp = new Date().toLocaleTimeString();
    const isFulfilled = action.type.endsWith('/fulfilled');
    const isRejected = action.type.endsWith('/rejected');
    const isPending = action.type.endsWith('/pending');

    const logEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actionType: action.type,
      status: isFulfilled ? 'SUCCESS' : isRejected ? 'FAILED' : 'PENDING',
      timestamp,
      payload: action.payload || action.meta?.arg || null,
      error: isRejected ? (action.error?.message || 'Operation failed') : null
    };

    console.info(
      `%c[REDUX MIDDLEWARE MONITOR] %c${action.type}%c - Status: ${logEntry.status}`,
      'color: #0d9488; font-weight: bold',
      'color: #2563eb; font-weight: bold',
      logEntry.status === 'SUCCESS' ? 'color: #16a34a' : logEntry.status === 'FAILED' ? 'color: #dc2626' : 'color: #d97706',
      logEntry
    );

    // Save audit log to local session for audit trail inspection
    try {
      const storedLogs = JSON.parse(sessionStorage.getItem('rajshree_monitored_actions') || '[]');
      storedLogs.unshift(logEntry);
      sessionStorage.setItem('rajshree_monitored_actions', JSON.stringify(storedLogs.slice(0, 50)));
    } catch {
      // Ignore session storage errors
    }
  }

  return result;
};
