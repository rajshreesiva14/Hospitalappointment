import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/AppointmentContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';

export const PatientOverview = () => {
  const navigate = useNavigate();
  const {
    appointmentCount,
    upcomingAppointments,
    appointmentHistory,
    rescheduleAppointment,
    cancelAppointment
  } = useHospital();

  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  return (
    <div className="space-y-6">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Consultations</span>
            <span className="text-2xl font-black text-slate-800">{appointmentCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Upcoming Visits</span>
            <span className="text-2xl font-black text-cyan-700">{upcomingAppointments.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Completed Consultations</span>
            <span className="text-2xl font-black text-emerald-700">
              {appointmentHistory.filter((a) => a.status === 'Completed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Appointment Highlight */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="text-base font-bold text-slate-800">Next Upcoming OPD Visit</h3>
          </div>
          <Link
            to="/patient/upcoming"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>View All Upcoming</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {nextAppointment ? (
          <AppointmentCard
            appointment={nextAppointment}
            onReschedule={() => navigate('/appointments')}
            onCancel={() => navigate('/appointments')}
          />
        ) : (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-400 font-medium">
              You do not have any upcoming OPD appointment scheduled right now.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/book-appointment')}
              icon={Calendar}
            >
              Book Doctor Consultation Now
            </Button>
          </div>
        )}
      </div>

      {/* Quick Action Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50/60 p-6 rounded-3xl border border-teal-100 space-y-3">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Need Specialized Consultation?</span>
          </div>
          <p className="text-xs text-slate-600">
            Browse our top rated medical faculty in Cardiology, Psychology, Orthopedics, and Neurology.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/doctors')}
            className="bg-white"
          >
            Find Available Doctors
          </Button>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50/60 p-6 rounded-3xl border border-indigo-100 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Health & Medical Records</span>
          </div>
          <p className="text-xs text-slate-600">
            Keep your patient contact info, past diagnosis notes, and emergency emergency contacts updated.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/profile')}
            className="bg-white text-indigo-700 border-indigo-200"
          >
            Update Medical Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
