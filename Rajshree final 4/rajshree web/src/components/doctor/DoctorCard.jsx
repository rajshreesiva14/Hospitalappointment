import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  IndianRupee,
  Award,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const DoctorCard = ({ doctor, onSelectDoctor }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (onSelectDoctor) {
      onSelectDoctor(doctor);
    }
    navigate(`/book-appointment?doctorId=${doctor.id}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1">
      {/* Top Banner & Doctor Avatar */}
      <div className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Avatar with rating badge and optimized doctor image */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={`Portrait of ${doctor.name}`}
                loading="lazy"
                decoding="async"
                width="112"
                height="112"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.doctor-avatar-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-teal-100 shadow-md group-hover:border-teal-400 group-hover:scale-105 transition-all"
              />
            ) : null}

            <div
              className={`doctor-avatar-fallback w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-700 to-cyan-700 text-white flex flex-col items-center justify-center border-2 border-teal-100 shadow-md group-hover:border-teal-400 group-hover:scale-105 transition-all ${
                doctor.image ? 'hidden' : 'flex'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-teal-100" />
              </div>
              <span className="text-[10px] font-bold text-teal-100 mt-1 uppercase tracking-wider">
                Doctor
              </span>
            </div>
            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
              <span className="bg-slate-900/90 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-amber-400/40">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {doctor.rating}
              </span>
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-1.5">
              <Badge variant="teal" size="sm">
                {doctor.specialty}
              </Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {doctor.reviewsCount} patient reviews
              </span>
            </div>

            <div>
              <Link
                to={`/doctor/${doctor.id}`}
                aria-label={`View doctor profile of ${doctor.name}`}
                className="text-lg font-bold text-slate-900 hover:text-teal-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
              >
                {doctor.name}
              </Link>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                {doctor.qualification}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <Award className="w-3.5 h-3.5 text-teal-600" />
                <strong>{doctor.experience} yrs</strong> exp
              </span>

              <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                {doctor.room}
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio snippet */}
        <p className="text-xs text-slate-600 mt-4 line-clamp-2 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          {doctor.about}
        </p>

        {/* Schedule & Timing overview */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Available Days:
            </span>
            <span className="text-slate-800 font-semibold truncate max-w-[190px]">
              {doctor.availableDays.join(', ')}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              <span>Available Timings:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {doctor.availableTimeSlots.slice(0, 4).map((slot) => (
                <span
                  key={slot}
                  className="px-2 py-0.5 bg-teal-50 text-teal-800 text-[11px] font-semibold rounded-md border border-teal-100"
                >
                  {slot}
                </span>
              ))}
              {doctor.availableTimeSlots.length > 4 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md">
                  +{doctor.availableTimeSlots.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Fee & Action Buttons */}
      <div className="mt-auto px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Consultation Fee</span>
          <span className="text-lg font-extrabold text-teal-800 flex items-center">
            <IndianRupee className="w-4 h-4 inline" />
            {doctor.consultationFee}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctor/${doctor.id}`}
            aria-label={`View profile and portfolio of ${doctor.name}`}
            className="px-3 py-2 text-xs font-bold text-teal-700 bg-white hover:bg-teal-50 border border-teal-200 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Profile & Portfolio
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={handleBookNow}
            icon={ChevronRight}
            iconPosition="right"
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};
