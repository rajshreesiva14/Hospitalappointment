import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';
import { RescheduleModal } from '../../components/appointment/RescheduleModal';
import {
  ShieldCheck,
  Calendar,
  IndianRupee,
  Users,
  Stethoscope,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    appointments,
    doctors,
    getAvailableSlots,
    rescheduleAppointment,
    cancelAppointment,
    updateDoctor
  } = useHospital();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'doctors' | 'analytics'
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForReschedule, setSelectedForReschedule] = useState(null);

  // Calculate Admin Hospital Analytics via useMemo
  const analytics = useMemo(() => {
    const totalAppointments = appointments.length;
    const confirmedCount = appointments.filter(
      (a) => a.status === 'Confirmed' || a.status === 'Rescheduled'
    ).length;
    const completedCount = appointments.filter((a) => a.status === 'Completed').length;
    const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

    // Total consultation revenue generated
    const totalRevenue = appointments
      .filter((a) => a.status !== 'Cancelled')
      .reduce((sum, a) => sum + (Number(a.consultationFee) || 0), 0);

    return {
      totalAppointments,
      confirmedCount,
      completedCount,
      cancelledCount,
      totalRevenue,
      totalDoctors: doctors.length
    };
  }, [appointments, doctors]);

  // Filtered Appointments list
  const filteredBookings = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.patientName.toLowerCase().includes(q) ||
        apt.id.toLowerCase().includes(q) ||
        apt.doctorSpecialty.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [appointments, filterStatus, searchQuery]);

  const activeDoctor = useMemo(() => {
    if (!selectedForReschedule) return null;
    return doctors.find((d) => d.id === selectedForReschedule.doctorId) || null;
  }, [doctors, selectedForReschedule]);

  const handleAdminCancel = async (apt) => {
    const reason = window.prompt(
      `Admin Action: Enter administrative reason for cancelling booking #${apt.id}:`,
      'Hospital OPD schedule emergency reassignment'
    );
    if (reason) {
      await cancelAppointment(apt.id, reason);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Hospital Executive Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold m-0">
              Hospital Central Operations & Booking Desk
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Logged in as: <strong>{user?.name || 'Medical Superintendent'}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/book-appointment')}
              icon={PlusCircle}
            >
              Book OPD for Patient
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Bookings</span>
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            {analytics.totalAppointments}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            {analytics.confirmedCount} Active / Confirmed
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">OPD Revenue</span>
            <IndianRupee className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            ₹{analytics.totalRevenue.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">
            100% Digital Pre-paid
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Consultants</span>
            <Stethoscope className="w-5 h-5 text-cyan-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            {analytics.totalDoctors}
          </p>
          <span className="text-xs text-teal-600 font-semibold mt-1 block">
            Across 8 Departments
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Cancellations</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            {analytics.cancelledCount}
          </p>
          <span className="text-xs text-rose-600 font-semibold mt-1 block">
            Slots released back
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4">
        {[
          { id: 'bookings', label: 'All Patient Bookings' },
          { id: 'doctors', label: 'Manage Specialists & Fees' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ALL PATIENT BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Controls: Search and Status filter */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {['All', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterStatus === st
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, doctor, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-sm">
              No hospital bookings match your filter criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onReschedule={() => setSelectedForReschedule(apt)}
                  onCancel={handleAdminCancel}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE SPECIALISTS & FEES */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Hospital Medical Faculty Registry</h3>
              <p className="text-xs text-slate-500">
                Update consultation tariffs, examine patient ratings, and check routine OPD chambers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Specialty & Department</th>
                  <th className="py-3 px-4">Chamber</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Fee (₹)</th>
                  <th className="py-3 px-4">Available Days</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center shrink-0">
                        <Stethoscope className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span>{doc.name}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {doc.experience} yrs experience
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-teal-800">{doc.specialty}</span>
                      <span className="text-[10px] text-slate-400 block">{doc.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{doc.room}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">
                      ⭐ {doc.rating} ({doc.reviewsCount})
                    </td>
                    <td className="py-3.5 px-4 font-bold text-teal-900">
                      ₹{doc.consultationFee}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {doc.availableDays.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const newFee = window.prompt(
                            `Update consultation fee for ${doc.name}:`,
                            doc.consultationFee
                          );
                          if (newFee && !isNaN(newFee)) {
                            updateDoctor({ ...doc, consultationFee: Number(newFee) });
                          }
                        }}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 transition"
                      >
                        Adjust Fee
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {selectedForReschedule && (
        <RescheduleModal
          isOpen={!!selectedForReschedule}
          onClose={() => setSelectedForReschedule(null)}
          appointment={selectedForReschedule}
          doctor={activeDoctor}
          getAvailableSlots={getAvailableSlots}
          onConfirmReschedule={rescheduleAppointment}
        />
      )}
    </div>
  );
};
