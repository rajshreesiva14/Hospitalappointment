import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  PhoneCall,
  MapPin,
  Mail,
  ShieldCheck,
  Award,
  Clock,
  Heart
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Hospital Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  RAJSHREE HOSPITAL
                </span>
                <p className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">
                  Care with Compassion
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Rajshree Multispeciality Hospital & Medical Research Institute is a premier tertiary care center equipped with state-of-the-art diagnostic labs, digital Cath labs, and robotic joint care.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-900/60 text-teal-300 border border-teal-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> NABH Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                <Award className="w-3.5 h-3.5 text-cyan-400" /> JCI Gold Seal
              </span>
            </div>
          </div>

          {/* Column 2: Centers of Excellence */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Centres of Excellence
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/doctors?specialty=Cardiology" className="hover:text-teal-400 transition-colors">
                  Institute of Cardiac Sciences (Cardiology)
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Psychology+%26+Behavioral+Health" className="hover:text-teal-400 transition-colors">
                  Clinical Psychology & Mental Health
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Neurology" className="hover:text-teal-400 transition-colors">
                  Advanced Neurological Sciences & Stroke Unit
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Orthopedics+%26+Joint+Replacement" className="hover:text-teal-400 transition-colors">
                  Robotic Orthopedics & Joint Replacement
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Pediatrics+%26+Child+Care" className="hover:text-teal-400 transition-colors">
                  Pediatrics & Neonatal Intensive Care (NICU)
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Dermatology+%26+Cosmetology" className="hover:text-teal-400 transition-colors">
                  Dermatology, Laser & Trichology Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-500 pl-2">
              Patient Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/doctors" className="hover:text-cyan-400 transition-colors">
                  Find a Doctor & Check Timing
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="hover:text-cyan-400 transition-colors">
                  Book OPD Appointment Online
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="hover:text-cyan-400 transition-colors">
                  Appointment Rescheduling & Cancellation
                </Link>
              </li>
              <li>
                <Link to="/patient/profile" className="hover:text-cyan-400 transition-colors">
                  Patient Health Records & Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-400 transition-colors">
                  Staff & Doctor Admin Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              Emergency & Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Rajshree Health City, Sector 14, Ring Road Campus, New Delhi 110024
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-red-300 font-semibold">
                  Emergency: 1800-419-7000 (Toll Free)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>appointments@rajshreehospital.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Casualty & Trauma Care: 24 Hours Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Rajshree Multispeciality Hospital Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for patient wellness & healthcare excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
