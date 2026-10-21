import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Calendar,
  Clock,
  History,
  Shield,
  LayoutDashboard,
  FileText
} from 'lucide-react';

export const PatientDashboardLayout = () => {
  const { user } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150 ${
      isActive
        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
        : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50/60'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Patient Top Profile Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-400 text-teal-950 font-black text-2xl flex items-center justify-center shadow-lg">
              {user?.name ? user.name[0].toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold m-0">{user?.name || 'Registered Patient'}</h1>
                <span className="bg-teal-700/80 text-teal-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-teal-500/40">
                  {user?.patientId || 'PT-1001'}
                </span>
              </div>
              <p className="text-xs text-teal-200/80 mt-1">
                {user?.email} • {user?.phone || '+91 9876543210'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-white/10 text-teal-200 px-3 py-1.5 rounded-xl border border-white/10">
              Blood Group: <strong>{user?.bloodGroup || 'O+'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Nested Navigation Sidebar + Outlet Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-2 block">
            Dashboard Navigation
          </span>

          <NavLink to="/patient" end className={navItemClass}>
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/patient/appointments" className={navItemClass}>
            <Calendar className="w-4 h-4 shrink-0" />
            <span>All Bookings</span>
          </NavLink>

          <NavLink to="/patient/upcoming" className={navItemClass}>
            <Clock className="w-4 h-4 shrink-0" />
            <span>Upcoming OPD</span>
          </NavLink>

          <NavLink to="/patient/history" className={navItemClass}>
            <History className="w-4 h-4 shrink-0" />
            <span>Past History</span>
          </NavLink>

          <NavLink to="/patient/profile" className={navItemClass}>
            <User className="w-4 h-4 shrink-0" />
            <span>Health Profile</span>
          </NavLink>
        </aside>

        {/* Dynamic Nested Content rendered via Experiment 3 f Outlet */}
        <main className="md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
