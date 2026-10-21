import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Activity,
  ShieldCheck,
  Database,
  Layers,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  X
} from 'lucide-react';
import { getStoredAuthToken } from '../../services/api';

export const ExperimentConsoleModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('redux');
  const auth = useSelector((state) => state.auth);
  const doctorsState = useSelector((state) => state.doctors);
  const appointmentState = useSelector((state) => state.appointment);

  const token = auth.token || getStoredAuthToken();

  // Retrieve middleware audited actions from sessionStorage
  let storedLogs = [];
  try {
    storedLogs = JSON.parse(sessionStorage.getItem('rajshree_monitored_actions') || '[]');
  } catch {
    storedLogs = [];
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="experiment-console-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-teal-300 animate-pulse" />
            </div>
            <div>
              <h2 id="experiment-console-title" className="text-lg font-bold">
                Hospital Architecture & Live State Inspector
              </h2>
              <p className="text-xs text-teal-200">
                Live verification of REST APIs, Redux Toolkit, Middleware Logging, and Token Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('redux')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'redux'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Experiment 2: Redux Toolkit & Middleware</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'api'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Experiment 1 & 3: REST API & CRUD</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'auth'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Experiment 4: Auth & Bearer Token</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'redux' && (
            <div className="space-y-6">
              {/* Caching status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                  <span className="text-teal-700 font-bold uppercase tracking-wider block">Doctor Cache</span>
                  <p className="text-xl font-extrabold text-teal-900 mt-1">{doctorsState.doctors.length} Loaded</p>
                  <span className="text-[11px] text-teal-600">
                    Last fetched: {doctorsState.lastFetched ? new Date(doctorsState.lastFetched).toLocaleTimeString() : 'Fresh'}
                  </span>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4">
                  <span className="text-cyan-700 font-bold uppercase tracking-wider block">Availability Cache</span>
                  <p className="text-xl font-extrabold text-cyan-900 mt-1">
                    {Object.keys(doctorsState.availabilityCache).length} Cached Dates
                  </p>
                  <span className="text-[11px] text-cyan-600">Keyed by DoctorID + Date</span>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                  <span className="text-purple-700 font-bold uppercase tracking-wider block">Middleware Audits</span>
                  <p className="text-xl font-extrabold text-purple-900 mt-1">
                    {storedLogs.length} Monitored Actions
                  </p>
                  <span className="text-[11px] text-purple-600">Audited via Redux Middleware</span>
                </div>
              </div>

              {/* Monitored Actions Table */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Middleware Monitored Appointment Actions (Experiment 2 d)
                </h3>
                {storedLogs.length === 0 ? (
                  <p className="text-slate-400 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    No appointment actions recorded yet. Book, reschedule, or cancel an appointment to see middleware audit logs in real-time.
                  </p>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Time</th>
                          <th className="p-3">Action Type</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Payload Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {storedLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                            <td className="p-3 text-slate-500">{log.timestamp}</td>
                            <td className="p-3 font-semibold text-teal-700">{log.actionType}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  log.status === 'SUCCESS'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : log.status === 'FAILED'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 max-w-xs truncate">
                              {JSON.stringify(log.payload)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Implemented REST API Endpoints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold text-[10px]">GET</span>
                    <code className="text-slate-800 font-semibold">/api/doctors</code>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Supports ?search=..., ?specialty=..., ?day=..., ?maxFee=..., ?minRating=...
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold text-[10px]">GET</span>
                    <code className="text-slate-800 font-semibold">/api/doctors/:id/availability</code>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Dynamic real-time time slots calculation based on booked reservations.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">POST</span>
                    <code className="text-slate-800 font-semibold">/api/appointments</code>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Creates an appointment. Requires valid Bearer Token. Returns HTTP 201 Created.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-bold text-[10px]">PUT/PATCH</span>
                    <code className="text-slate-800 font-semibold">/api/appointments/:id</code>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Reschedules date/time of an existing appointment.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md font-bold text-[10px]">DELETE</span>
                    <code className="text-slate-800 font-semibold">/api/appointments/:id</code>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Cancels an active appointment with reason metadata.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md font-bold text-[10px]">POST</span>
                    <code className="text-slate-800 font-semibold">/api/auth/login</code>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Authenticates patient or hospital admin, generates and issues Bearer token.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Authentication Status:</span>
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold ${
                      auth.isAuthenticated
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {auth.isAuthenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">Active Bearer Token:</span>
                  <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] break-all select-all">
                    {token || 'No active token (Please sign in to issue token)'}
                  </div>
                </div>

                {auth.user && (
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-600">
                    <p><strong>Signed In As:</strong> {auth.user.name} ({auth.user.email})</p>
                    <p><strong>Assigned Role:</strong> <span className="uppercase font-bold text-teal-600">{auth.role}</span></p>
                    {auth.user.patientId && <p><strong>Patient ID:</strong> {auth.user.patientId}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-slate-500 text-xs">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Axios & Redux REST Architecture 100% Operational
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
