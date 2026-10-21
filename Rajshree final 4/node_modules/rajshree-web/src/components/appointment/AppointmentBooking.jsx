import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  User,
  CreditCard,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Lock,
  Stethoscope
} from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TimeSlot } from './TimeSlot';
import {
  validateEmail,
  validatePhone,
  validateAppointmentDate,
  validateTimeSlot,
  validateDoctorSelection
} from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';

export const AppointmentBooking = ({
  doctors = [],
  selectedDoctor: initialDoctor,
  getAvailableSlots,
  onBookAppointment
}) => {
  const [searchParams] = useSearchParams();
  const { user, updateProfile, login } = useAuth();

  // Booking step: 1: Doctor & Date/Time -> 2: Patient Info -> 3: Review & Summary -> 4: Confirmed
  const [step, setStep] = useState(1);

  // Doctor selection state
  const [selectedDoctorId, setSelectedDoctorId] = useState(() => {
    const paramId = searchParams.get('doctorId');
    if (paramId) return Number(paramId);
    if (initialDoctor) return initialDoctor.id;
    return doctors.length > 0 ? doctors[0].id : '';
  });

  // Appointment date and time state
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // Default to tomorrow's date formatted as YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  // Patient details state
  const [patientForm, setPatientForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '32',
    gender: user?.gender || 'Male',
    symptoms: '',
    medicalHistory: ''
  });

  // Sync patient details when user is authenticated
  useEffect(() => {
    if (user) {
      setPatientForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        age: prev.age || user.age || '32',
        gender: prev.gender || user.gender || 'Male'
      }));
    }
  }, [user]);

  // Form error states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Keep selectedDoctorId in sync with search params, initialDoctor, and doctors array
  useEffect(() => {
    const paramId = searchParams.get('doctorId');
    if (paramId && doctors.some((d) => String(d.id) === String(paramId))) {
      setSelectedDoctorId(Number(paramId));
    } else if (initialDoctor?.id && doctors.some((d) => String(d.id) === String(initialDoctor.id))) {
      setSelectedDoctorId(initialDoctor.id);
    } else if (doctors.length > 0) {
      const exists = doctors.some((d) => String(d.id) === String(selectedDoctorId));
      if (!selectedDoctorId || !exists) {
        setSelectedDoctorId(doctors[0].id);
      }
    }
  }, [searchParams, initialDoctor, doctors, selectedDoctorId]);

  // Find currently selected doctor object with robust fallback
  const currentDoctor = useMemo(() => {
    if (!doctors || doctors.length === 0) return initialDoctor || null;
    return (
      doctors.find((d) => String(d.id) === String(selectedDoctorId)) ||
      initialDoctor ||
      doctors[0] ||
      null
    );
  }, [doctors, selectedDoctorId, initialDoctor]);

  // Update available time slots when selected doctor or appointment date changes (Experiment 1 c requirement)
  useEffect(() => {
    if (currentDoctor && appointmentDate) {
      const dateErr = validateAppointmentDate(appointmentDate, currentDoctor.availableDays);
      if (!dateErr && getAvailableSlots) {
        const slots = getAvailableSlots(currentDoctor, appointmentDate);
        setAvailableSlots(slots);
        // Pre-select first open slot if available
        if (slots.length > 0 && (!selectedSlot || !slots.includes(selectedSlot))) {
          setSelectedSlot(slots[0]);
        }
      } else {
        setAvailableSlots([]);
        setSelectedSlot('');
      }
    } else {
      setAvailableSlots([]);
      setSelectedSlot('');
    }
  }, [currentDoctor, appointmentDate, getAvailableSlots]);

  // Calculate appointment summary & duration using useMemo (Experiment 1 e requirement)
  const appointmentSummary = useMemo(() => {
    if (!currentDoctor) return null;
    const baseFee = currentDoctor.consultationFee;
    const hospitalTax = Math.round(baseFee * 0.05); // 5% GST
    const totalAmount = baseFee + hospitalTax;
    const duration = currentDoctor.specialty.includes('Psychology') ? '45 mins' : '30 mins';

    return {
      doctorName: currentDoctor.name,
      specialty: currentDoctor.specialty,
      room: currentDoctor.room,
      date: appointmentDate,
      timeSlot: selectedSlot,
      duration,
      baseFee,
      tax: hospitalTax,
      totalAmount
    };
  }, [currentDoctor, appointmentDate, selectedSlot]);

  // Step 1 Validation (Doctor, Date, Slot)
  const validateStep1 = () => {
    const newErrors = {};
    const docErr = validateDoctorSelection(selectedDoctorId);
    if (docErr) newErrors.doctor = docErr;

    const dateErr = validateAppointmentDate(appointmentDate, currentDoctor?.availableDays);
    if (dateErr) newErrors.date = dateErr;

    const slotErr = validateTimeSlot(selectedSlot);
    if (slotErr) newErrors.slot = slotErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation (Patient Details)
  const validateStep2 = () => {
    const newErrors = {};
    if (!patientForm.name || patientForm.name.trim().length < 2) {
      newErrors.name = 'Patient full name is required.';
    }

    const emailErr = validateEmail(patientForm.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(patientForm.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    if (!patientForm.age || Number(patientForm.age) <= 0 || Number(patientForm.age) > 120) {
      newErrors.age = 'Please enter a valid age.';
    }

    if (!patientForm.symptoms || patientForm.symptoms.trim().length < 5) {
      newErrors.symptoms = 'Please describe your symptoms (minimum 5 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation (Review Confirmation)
  const validateStep3 = () => {
    const newErrors = {};
    if (!currentDoctor) {
      newErrors.submit = 'Please select a specialist doctor before confirming.';
    } else if (!appointmentDate) {
      newErrors.submit = 'Please choose a valid appointment date.';
    } else if (!selectedSlot) {
      newErrors.submit = 'Please choose an available appointment time slot.';
    } else if (!patientForm.name || patientForm.name.trim().length < 2) {
      newErrors.submit = 'Patient full name is required.';
    } else if (!patientForm.phone || patientForm.phone.trim().length < 10) {
      newErrors.submit = 'Valid 10-digit mobile number is required.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  // Step Navigations
  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Final booking execution using useCallback (Experiment 1 f requirement)
  const handleFinalBooking = useCallback(async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const doc = currentDoctor || (doctors && doctors[0]) || initialDoctor;
      if (!doc) {
        throw new Error('Specialist doctor information is unavailable. Please select a doctor.');
      }

      const totalFee =
        appointmentSummary?.totalAmount ||
        (doc.consultationFee ? doc.consultationFee + Math.round(doc.consultationFee * 0.05) : 1260);

      const bookingPayload = {
        doctorId: doc.id,
        doctorName: doc.name,
        doctorSpecialty: doc.specialty,
        doctorImage: doc.image || '',
        room: doc.room || 'Cardio Wing, OPD 301',
        date: appointmentDate,
        timeSlot: selectedSlot || availableSlots[0] || '10:00 AM',
        duration: appointmentSummary?.duration || (doc.specialty?.includes('Psychology') ? '45 mins' : '30 mins'),
        consultationFee: totalFee,
        patientName: patientForm.name?.trim() || user?.name || 'Patient Full Name',
        patientEmail: patientForm.email?.trim() || user?.email || 'rajshree.patient@health.org',
        patientPhone: patientForm.phone?.trim() || user?.phone || '9876543210',
        patientAge: Number(patientForm.age) || 32,
        patientGender: patientForm.gender || 'Male',
        symptoms: patientForm.symptoms?.trim() || 'General OPD consultation',
        medicalHistory: patientForm.medicalHistory?.trim() || 'None',
        paymentStatus: 'Pay at Hospital',
        paymentMethod: 'Pay at Hospital OPD Desk',
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
      };

      const result = await onBookAppointment(bookingPayload);
      const bookedRecord = result?.data || result;
      setConfirmedBooking(bookedRecord);
      setStep(4);

      // Trigger celebratory confetti
      try {
        if (typeof window !== 'undefined' && typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype.getContext) {
          const testCanvas = document.createElement('canvas');
          if (testCanvas.getContext && testCanvas.getContext('2d')) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrors({
        submit: err.response?.data?.message || err.message || 'Failed to confirm booking. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentDoctor,
    doctors,
    initialDoctor,
    availableSlots,
    appointmentDate,
    selectedSlot,
    appointmentSummary,
    patientForm,
    user,
    onBookAppointment,
    validateStep3
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step Indicator Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 -z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          {[
            { num: 1, label: 'Schedule' },
            { num: 2, label: 'Patient Info' },
            { num: 3, label: 'Review & Confirm' },
            { num: 4, label: 'Confirmed' }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span
                className={`text-xs mt-2 font-semibold ${
                  step >= s.num ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Doctor, Date, and Time Slot */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Step 1: Choose Specialist & OPD Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your required doctor, preferred appointment date, and available time slot.
            </p>
          </div>

          {/* Doctor Selector */}
          <div className="space-y-2 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Specialist Doctor
            </label>
            <select
              value={selectedDoctorId || (doctors.length > 0 ? doctors[0].id : '')}
              onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialty} (₹{doc.consultationFee})
                </option>
              ))}
            </select>
            {errors.doctor && <p className="text-xs text-red-500">{errors.doctor}</p>}
          </div>

          {/* Doctor Brief Card */}
          {currentDoctor && (
            <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100/80 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center border border-teal-200 shrink-0 shadow-sm">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">{currentDoctor.name}</h4>
                <p className="text-xs text-teal-700 font-semibold">{currentDoctor.specialty}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Available Days: <strong>{currentDoctor.availableDays.join(', ')}</strong> | Room: {currentDoctor.room}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Fee</span>
                <span className="text-base font-extrabold text-teal-800">
                  ₹{currentDoctor.consultationFee}
                </span>
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div className="space-y-2 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Appointment Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {errors.date && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.date}</span>
              </p>
            )}
          </div>

          {/* Time Slot Selector */}
          <div className="pt-2 text-left">
            <TimeSlot
              slots={availableSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
            />
            {errors.slot && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.slot}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleNextStep}
              icon={ChevronRight}
              iconPosition="right"
              disabled={!currentDoctor || !appointmentDate || !selectedSlot}
            >
              Next: Patient Information
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Patient Information Form */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Step 2: Patient Registration Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please enter the patient’s personal and medical health details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Patient Full Name"
              placeholder="e.g. Patient Full Name"
              value={patientForm.name}
              onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
              error={errors.name}
              required
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="patient@example.com"
              value={patientForm.email}
              onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
              error={errors.email}
              required
              icon={Mail}
              hint="Confirmation slip will be sent here"
            />

            <Input
              label="Mobile Phone Number"
              type="tel"
              placeholder="10-digit number"
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              error={errors.phone}
              required
              icon={Phone}
              hint="Format: 9876543210"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age (Years)"
                type="number"
                min="1"
                max="120"
                value={patientForm.age}
                onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                error={errors.age}
                required
              />

              <div className="space-y-1 text-left">
                <label className="block text-sm font-semibold text-slate-700">Gender</label>
                <select
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Symptoms and complaints */}
          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-slate-700">
              Primary Symptoms / Reason for Consultation <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Please describe symptoms, duration, current complaints..."
              value={patientForm.symptoms}
              onChange={(e) => setPatientForm({ ...patientForm, symptoms: e.target.value })}
              className={`w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                errors.symptoms ? 'border-red-500 bg-red-50/50' : ''
              }`}
            ></textarea>
            {errors.symptoms && <p className="text-xs text-red-500">{errors.symptoms}</p>}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="ghost" size="md" onClick={handlePrevStep} icon={ChevronLeft}>
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNextStep}
              icon={ChevronRight}
              iconPosition="right"
            >
              Next: Review & Confirm
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Consultation Summary & Confirmation */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Step 3: Consultation Summary & Review
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your appointment details and confirm your OPD consultation booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Consultation & Doctor Summary */}
            <div className="bg-teal-50/50 p-5 rounded-2xl border border-teal-100 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-teal-600" />
                Consultation Details
              </h3>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between pb-2 border-b border-teal-100/70">
                  <span className="text-slate-500">Attending Specialist:</span>
                  <span className="font-bold text-slate-900">{appointmentSummary?.doctorName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-teal-100/70">
                  <span className="text-slate-500">Specialty Department:</span>
                  <span className="font-semibold text-teal-800">{appointmentSummary?.specialty}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-teal-100/70">
                  <span className="text-slate-500">OPD Room / Location:</span>
                  <span className="font-semibold text-slate-800">{appointmentSummary?.room}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-teal-100/70">
                  <span className="text-slate-500">Scheduled Date & Time:</span>
                  <span className="font-bold text-teal-900">
                    {appointmentSummary?.date} at {appointmentSummary?.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-teal-100/70">
                  <span className="text-slate-500">Consultation Duration:</span>
                  <span className="font-semibold text-slate-800">{appointmentSummary?.duration}</span>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-600" />
                Patient Registration
              </h3>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Patient Full Name:</span>
                  <span className="font-bold text-slate-900">{patientForm.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Age & Gender:</span>
                  <span className="font-semibold text-slate-800">{patientForm.age} Years / {patientForm.gender}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Contact Mobile:</span>
                  <span className="font-semibold text-slate-800">{patientForm.phone}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">{patientForm.email}</span>
                </div>
                {patientForm.symptoms && (
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-0.5">Reported Symptoms:</span>
                    <p className="text-slate-700 font-medium bg-white p-2 rounded-lg border border-slate-200/60">
                      {patientForm.symptoms}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* OPD Billing & Counter Policy Card */}
          <div className="bg-gradient-to-r from-teal-50/70 to-cyan-50/70 p-5 rounded-2xl border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                  Pay at Hospital Desk
                </span>
                <span className="text-xs text-slate-500">No advance online payment required</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                You can pay the OPD fee at the hospital registration counter during check-in using Cash, UPI, Debit/Credit Card, or Mediclaim Insurance.
              </p>
            </div>

            <div className="text-right sm:text-right shrink-0 bg-white px-5 py-3 rounded-xl border border-teal-100 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Total Consultation Fee</span>
              <span className="text-xl font-extrabold text-teal-900">
                ₹{appointmentSummary?.totalAmount}
              </span>
            </div>
          </div>

          {errors.submit && (
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 text-left">
              {errors.submit}
            </p>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="ghost" size="md" onClick={handlePrevStep} icon={ChevronLeft}>
              Back
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={handleFinalBooking}
              isLoading={isSubmitting}
              icon={CheckCircle2}
              className="shadow-lg shadow-emerald-600/25"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Booking Confirmation Success */}
      {step === 4 && confirmedBooking && (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Booking Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Your OPD Appointment is Scheduled!
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              A digital appointment pass has been registered in the Rajshree Central OPD System.
            </p>
          </div>

          {/* Ticket Slip */}
          <div className="max-w-md mx-auto bg-slate-50 border-2 border-dashed border-teal-200 p-6 rounded-3xl text-left space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Appointment ID</span>
                <p className="text-sm font-mono font-bold text-teal-800">{confirmedBooking.id}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                Confirmed
              </span>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Consultant Doctor:</span>
                <span className="font-bold text-slate-800">{confirmedBooking.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department / Room:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="font-bold text-teal-900">
                  {confirmedBooking.date} at {confirmedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient Name:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment:</span>
                <span className="font-semibold text-teal-700">
                  Pay at Hospital Counter (₹{confirmedBooking.consultationFee || appointmentSummary?.totalAmount})
                </span>
              </div>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to={`/appointment/${confirmedBooking.id}`}
              className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-md transition flex items-center justify-center gap-1.5"
            >
              View Appointment Slip
            </Link>

            <Link
              to="/appointments"
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
            >
              Go to My Appointments
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
