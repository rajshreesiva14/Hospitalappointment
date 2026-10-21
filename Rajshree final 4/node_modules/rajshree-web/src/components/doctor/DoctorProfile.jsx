import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Award,
  BookOpen,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Languages,
  ChevronRight,
  HeartPulse,
  Brain,
  Bone,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const DoctorProfile = ({ doctor, onSelectDoctor }) => {
  const navigate = useNavigate();

  if (!doctor) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">Doctor Profile Not Found</h3>
        <p className="text-slate-500 text-sm mt-2">
          The requested doctor ID does not correspond to an active specialist in our registry.
        </p>
      </div>
    );
  }

  const handleBook = () => {
    if (onSelectDoctor) {
      onSelectDoctor(doctor);
    }
    navigate(`/book-appointment?doctorId=${doctor.id}`);
  };

  const getSpecialtyIcon = (specialty = '') => {
    if (specialty.toLowerCase().includes('cardio')) return <HeartPulse className="w-5 h-5 text-rose-500" />;
    if (specialty.toLowerCase().includes('psych')) return <Brain className="w-5 h-5 text-indigo-500" />;
    if (specialty.toLowerCase().includes('ortho')) return <Bone className="w-5 h-5 text-amber-500" />;
    return <Stethoscope className="w-5 h-5 text-teal-500" />;
  };

  return (
    <div className="space-y-8">
      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Doctor Portrait Avatar */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={`Official portrait of ${doctor.name}`}
                loading="eager"
                decoding="async"
                width="176"
                height="176"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.doctor-profile-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-teal-50 shadow-xl"
              />
            ) : null}

            <div
              className={`doctor-profile-fallback w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-teal-700 via-teal-800 to-cyan-800 text-white flex flex-col items-center justify-center border-4 border-teal-50 shadow-xl ${
                doctor.image ? 'hidden' : 'flex'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 flex items-center justify-center">
                <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 text-teal-100" />
              </div>
              <span className="text-xs font-bold text-teal-100 mt-2 uppercase tracking-wider">
                Medical Specialist
              </span>
            </div>
            <div className="absolute -bottom-3 inset-x-0 flex justify-center">
              <span className="bg-slate-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md border border-amber-400/40">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {doctor.rating} ({doctor.reviewsCount} verified reviews)
              </span>
            </div>
          </div>

          {/* Core Doctor Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50">
                {getSpecialtyIcon(doctor.specialty)}
              </span>
              <Badge variant="teal" size="md">
                {doctor.specialty}
              </Badge>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {doctor.department}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {doctor.name}
              </h1>
              <p className="text-sm font-semibold text-teal-700 mt-1">
                {doctor.qualification}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {doctor.about}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <span className="text-xs text-slate-400 font-medium block">Experience</span>
                <span className="text-base font-bold text-slate-800">{doctor.experience}+ Years</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <span className="text-xs text-slate-400 font-medium block">OPD Chamber</span>
                <span className="text-base font-bold text-slate-800">{doctor.room}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <span className="text-xs text-slate-400 font-medium block">Consultation Fee</span>
                <span className="text-base font-bold text-teal-700">₹{doctor.consultationFee}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <span className="text-xs text-slate-400 font-medium block">Languages</span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {doctor.languages?.join(', ') || 'English, Hindi'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Action Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6 bg-gradient-to-r from-teal-50/50 via-cyan-50/30 to-white p-5 rounded-2xl">
          <div className="space-y-2 text-left w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Available OPD Days</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableDays.map((day) => (
                <span
                  key={day}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs"
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-800 pt-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>Routine OPD Time Slots</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableTimeSlots.map((slot) => (
                <span
                  key={slot}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-teal-100/70 text-teal-900 border border-teal-200"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={handleBook}
              icon={ChevronRight}
              iconPosition="right"
              className="w-full sm:w-auto shadow-lg shadow-teal-500/25"
            >
              Book OPD Appointment
            </Button>
          </div>
        </div>
      </div>

      {/* Doctor Portfolio Section (Requested explicitly by user) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Clinical Expertise & Specialization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clinical Expertise */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">
                Clinical Expertise & Specialization Portfolio
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Key medical interventions, diagnostic protocols, and patient therapies managed by {doctor.name}:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {doctor.portfolio?.clinicalExpertise?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Education & Advanced Training */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Education & Advanced Fellowships</h3>
            </div>

            <div className="space-y-3 pt-1">
              {doctor.portfolio?.education?.map((edu, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-cyan-50/40 border border-cyan-100/70 text-xs font-medium text-slate-700"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-600 shrink-0"></div>
                  <span>{edu}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Awards, Accreditations & Memberships */}
        <div className="space-y-6">
          {/* Awards & Honors */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Awards & Recognitions</h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              {doctor.portfolio?.awards?.map((award, index) => (
                <li key={index} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{award}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Memberships */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Professional Memberships</h3>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              {doctor.portfolio?.memberships?.map((mem, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                  <span>{mem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
