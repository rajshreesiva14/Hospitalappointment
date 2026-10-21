import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHospital } from '../context/AppointmentContext';
import { SearchBar } from '../components/doctor/SearchBar';
import { DoctorCard } from '../components/doctor/DoctorCard';
import { SPECIALTIES } from '../data/doctorsData';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Activity,
  ArrowRight,
  PhoneCall,
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Home = () => {
  const navigate = useNavigate();
  const {
    filteredDoctors,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    selectDoctor
  } = useHospital();

  const searchSectionRef = useRef(null);

  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const specialtyIcons = {
    Cardiology: <HeartPulse className="w-6 h-6 text-rose-500" />,
    'Psychology & Behavioral Health': <Brain className="w-6 h-6 text-indigo-500" />,
    'Orthopedics & Joint Replacement': <Bone className="w-6 h-6 text-amber-500" />,
    'Pediatrics & Child Care': <Baby className="w-6 h-6 text-emerald-500" />,
    'Dermatology & Cosmetology': <Sparkles className="w-6 h-6 text-cyan-500" />,
    Neurology: <Activity className="w-6 h-6 text-purple-500" />
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 text-white rounded-b-3xl sm:rounded-3xl shadow-xl mx-0 sm:mx-4 lg:mx-8 mt-0 sm:mt-4 p-8 sm:p-12 lg:p-16">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl relative z-10 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-700/60 border border-teal-500/40 text-teal-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NABH Accredited Tertiary Super-Speciality Hospital</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white m-0">
            Advanced Healthcare <br />
            <span className="bg-gradient-to-r from-teal-200 via-cyan-200 to-white bg-clip-text text-transparent">
              With Human Compassion
            </span>
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-2xl">
            Book verified appointments with distinguished medical professors, cardiac surgeons, clinical psychologists, and orthopedic specialists. Experience zero waiting time with our digital OPD scheduling.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToSearch}
              icon={Calendar}
              className="bg-white hover:bg-slate-100 !text-teal-900 font-extrabold shadow-lg"
            >
              Book OPD Appointment
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/doctors')}
              icon={Stethoscope}
              className="border-teal-300 text-white hover:bg-teal-700/60"
            >
              Explore All Specialists
            </Button>
          </div>

          {/* Key Trust Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-teal-700/60 text-teal-100">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white block">50+</span>
              <span className="text-xs text-teal-200">Senior Consultants</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white block">25k+</span>
              <span className="text-xs text-teal-200">Happy Patients</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white block">99.4%</span>
              <span className="text-xs text-teal-200">Satisfaction Score</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white block">24/7</span>
              <span className="text-xs text-teal-200">ICU & Emergency Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* Centers of Excellence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
              Specialized Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Centres of Excellence
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a clinical department to view qualified doctors and available consultation schedules.
            </p>
          </div>

          <Link
            to="/doctors"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SPECIALTIES.filter((s) => s !== 'All Specialties')
            .slice(0, 6)
            .map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => {
                    setSelectedSpecialty(spec);
                    scrollToSearch();
                  }}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-sm'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    {specialtyIcons[spec] || <Stethoscope className="w-6 h-6 text-teal-600" />}
                  </div>
                  <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                    {spec}
                  </span>
                </button>
              );
            })}
        </div>
      </section>

      {/* Doctor Search & Live Available Doctors Section (Ref for scroll) */}
      <section
        ref={searchSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
              Verified Medical Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Available Doctors & Portfolios
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Search by specialist name, specialty, or condition. Review ratings, consultation fees, and available timings below.
            </p>
          </div>

          <div className="w-full md:w-96">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              autoFocus={false}
              placeholder="Search cardiologist, psychologist, fees..."
            />
          </div>
        </div>

        {/* Available Doctors Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.slice(0, 4).map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelectDoctor={selectDoctor}
              />
            ))}
          </div>

          {filteredDoctors.length > 4 && (
            <div className="text-center pt-6">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/doctors')}
                icon={ArrowRight}
                iconPosition="right"
              >
                View All {filteredDoctors.length} Doctors
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Hospital Features & Emergency Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold text-teal-400 tracking-wider">
                Immediate Assistance
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                24/7 Casualty & Critical Care
              </h3>
              <p className="text-xs text-slate-400">
                Level-1 trauma center, round-the-clock cardiac ambulance, and fully operational critical care resuscitation units.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Emergency Hotline</span>
              </div>
              <p className="text-2xl font-black text-white">1800-419-7000</p>
              <p className="text-[11px] text-slate-400">Toll Free, Instant Medical Response</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/book-appointment')}
                icon={Calendar}
                className="w-full"
              >
                Schedule Non-Emergency OPD
              </Button>
              <Link
                to="/doctors"
                className="text-xs text-center text-teal-300 hover:text-white py-1 transition"
              >
                Check Doctor OPD Schedules →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
