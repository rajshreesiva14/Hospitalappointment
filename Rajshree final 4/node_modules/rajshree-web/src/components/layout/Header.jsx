import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Calendar,
  User,
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  LogOut,
  Stethoscope,
  Clock,
  Sparkles,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { ExperimentConsoleModal } from '../common/ExperimentConsoleModal';

export const Header = () => {
  const { user, isAuthenticated, isAdmin, isPatient, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
      isActive
        ? 'bg-teal-50 text-teal-700 shadow-sm shadow-teal-500/10 border border-teal-200/60'
        : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top hospital announcement bar */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-cyan-950 text-teal-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>24/7 Emergency & Ambulance: <strong>1800-419-7000</strong></span>
            </span>
            <span className="hidden sm:inline-block text-teal-400/40">|</span>
            <span className="hidden sm:flex items-center gap-1 text-teal-200">
              <Clock className="w-3.5 h-3.5" /> OPD: 8:00 AM - 8:00 PM (Mon-Sat)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsConsoleOpen(true)}
              className="inline-flex items-center gap-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer"
              title="Inspect Live Redux Store, REST API endpoints, Token, and Middleware logs"
            >
              <Activity className="w-3 h-3 text-teal-300 animate-pulse" />
              <span>Live Architecture Console</span>
            </button>
            <span className="hidden md:inline-flex items-center gap-1 bg-teal-800/80 text-teal-200 px-2 py-0.5 rounded-full text-[11px] border border-teal-700">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> NABH & JCI Accredited
            </span>
            <span className="hidden sm:inline text-teal-300/80">OPD Portal</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hospital Brand */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                  RAJSHREE
                </span>
                <span className="bg-teal-100/80 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Care+
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Multispeciality Hospital & Research Center
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/home" end className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/doctors" className={navLinkStyle}>
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Find Doctors
            </NavLink>
            <NavLink to="/book-appointment" className={navLinkStyle}>
              <Calendar className="w-4 h-4 text-teal-600" />
              Book Appointment
            </NavLink>
            <NavLink to="/appointments" className={navLinkStyle}>
              Appointments
            </NavLink>

            {/* Role-specific NavLinks */}
            {isAuthenticated && (
              <NavLink to="/patient" className={navLinkStyle}>
                <User className="w-4 h-4 text-teal-600" />
                Patient Dashboard
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin" className={navLinkStyle}>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700">Admin Portal</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action buttons / User profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl py-1.5 px-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.name || 'Authorized User'}
                    </p>
                    <span className="text-[10px] uppercase font-semibold text-teal-600 tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  className="text-slate-500 hover:text-red-600"
                  title="Logout"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  icon={User}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/book-appointment')}
                  icon={Sparkles}
                >
                  Book OPD
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <NavLink
            to="/home"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
              }`
            }
          >
            Find Doctors
          </NavLink>
          <NavLink
            to="/book-appointment"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
              }`
            }
          >
            Book Appointment
          </NavLink>
          <NavLink
            to="/appointments"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
              }`
            }
          >
            Appointments
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/patient"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
                }`
              }
            >
              Patient Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-base font-semibold ${
                  isActive ? 'bg-purple-50 text-purple-700' : 'text-purple-600'
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                icon={LogOut}
                className="w-full"
              >
                Logout ({user?.name})
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Sign In / Login
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Live Architecture, Redux, REST API, Token & Middleware Inspector Modal */}
      <ExperimentConsoleModal isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
    </header>
  );
};
