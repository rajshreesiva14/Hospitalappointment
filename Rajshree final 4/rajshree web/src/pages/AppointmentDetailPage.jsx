import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHospital } from '../context/AppointmentContext';
import { RescheduleModal } from '../components/appointment/RescheduleModal';
import {
  Printer,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  FileText,
  CreditCard,
  RotateCcw,
  XCircle,
  AlertCircle,
  ArrowLeft,
  HeartPulse
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loading } from '../components/common/Loading';

export const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getAppointmentById,
    fetchAppointmentById,
    doctors,
    getAvailableSlots,
    rescheduleAppointment,
    cancelAppointment,
    isAppointmentLoading
  } = useHospital();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [asyncAppointment, setAsyncAppointment] = useState(null);
  const [isFetchingRecord, setIsFetchingRecord] = useState(false);

  const localAppointment = useMemo(() => {
    return getAppointmentById ? getAppointmentById(id) : null;
  }, [id, getAppointmentById]);

  useEffect(() => {
    if (!localAppointment && id && fetchAppointmentById) {
      setIsFetchingRecord(true);
      fetchAppointmentById(id)
        .then((res) => {
          if (res) {
            setAsyncAppointment(res);
          }
        })
        .finally(() => {
          setIsFetchingRecord(false);
        });
    }
  }, [id, localAppointment, fetchAppointmentById]);

  const appointment = localAppointment || asyncAppointment;

  const doctor = useMemo(() => {
    if (!appointment) return null;
    return (
      (doctors || []).find((d) => String(d.id) === String(appointment.doctorId)) || {
        id: appointment.doctorId,
        name: appointment.doctorName,
        specialty: appointment.doctorSpecialty,
        room: appointment.room,
        consultationFee: appointment.consultationFee,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      }
    );
  }, [appointment, doctors]);

  if (isFetchingRecord || (!appointment && isAppointmentLoading)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        <Loading message="Retrieving appointment consultation slip from hospital server..." size="lg" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Appointment Record Not Found</h2>
        <p className="text-xs text-slate-500">
          We could not locate any booking with ID #{id}.
        </p>
        <Button variant="primary" onClick={() => navigate('/appointments')} icon={ArrowLeft}>
          Back to Appointments
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    const reason = window.prompt(
      'Are you sure you want to cancel this appointment? Please state a reason:',
      'Schedule conflict'
    );
    if (reason) {
      await cancelAppointment(appointment.id, reason);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={() => navigate('/appointments')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Appointments</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} icon={Printer}>
            Print Slip
          </Button>

          {appointment.status !== 'Cancelled' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRescheduling(true)}
                icon={RotateCcw}
              >
                Reschedule
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancel}
                icon={XCircle}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Official OPD Pass Slip (Printable) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Slip Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                RAJSHREE MULTISPECIALITY HOSPITAL
              </h2>
              <p className="text-[11px] text-teal-700 font-semibold uppercase tracking-wider">
                Digital Outpatient Department (OPD) Consultation Slip
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Appointment Number
            </span>
            <span className="text-base font-mono font-extrabold text-slate-900">
              {appointment.id}
            </span>
            <div className="mt-1">
              <Badge
                variant={appointment.status === 'Confirmed' ? 'emerald' : appointment.status === 'Cancelled' ? 'rose' : 'blue'}
                size="sm"
              >
                {appointment.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Doctor & Clinic Details */}
        <div className="bg-teal-50/50 rounded-2xl p-5 border border-teal-100 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center border border-teal-200 shrink-0 shadow-sm">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-teal-800">
              Attending Consultant
            </span>
            <h3 className="text-lg font-bold text-slate-900">{appointment.doctorName}</h3>
            <p className="text-xs font-semibold text-teal-700">{appointment.doctorSpecialty}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              {appointment.room}
            </p>
          </div>

          <div className="text-left sm:text-right bg-white p-3 rounded-xl border border-teal-100 shrink-0">
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-teal-900">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-teal-700 mt-1">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              <span>{appointment.timeSlot} ({appointment.duration || '30 mins'})</span>
            </div>
          </div>
        </div>

        {/* Patient Registration Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-teal-600" />
            Patient Information
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block text-[11px]">Full Name</span>
              <strong className="text-slate-900">{appointment.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Phone</span>
              <span className="font-semibold">{appointment.patientPhone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Email</span>
              <span className="font-semibold truncate block">{appointment.patientEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Age / Gender</span>
              <span className="font-semibold">{appointment.patientAge} Years / {appointment.patientGender}</span>
            </div>
          </div>

          {appointment.symptoms && (
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-400 font-bold block mb-1">Stated Symptoms & Reason for Visit:</span>
              <p className="text-slate-700">{appointment.symptoms}</p>
            </div>
          )}
        </div>

        {/* Payment & Billing Record */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-teal-600" />
            Payment & Facility Receipt
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block text-[11px]">Consultation Fee</span>
              <strong className="text-teal-800 text-sm">₹{appointment.consultationFee}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Payment Status</span>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {appointment.paymentStatus || 'Paid'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Payment Mode</span>
              <span className="font-semibold">{appointment.paymentMethod || 'Credit Card'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Transaction ID</span>
              <span className="font-mono text-slate-600">{appointment.transactionId || 'TXN-984210'}</span>
            </div>
          </div>
        </div>

        {/* Important Patient Instructions */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-700 uppercase tracking-wider">Hospital OPD Instructions:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Please arrive 15 minutes before your scheduled appointment time slot for vital checkup.</li>
            <li>Present this digital slip or SMS confirmation at the OPD reception desk for entry.</li>
            <li>Carry past medical prescriptions, recent blood reports, and X-ray/MRI films if available.</li>
            <li>For any emergency changes, call 1800-419-7000 or reschedule via the patient portal.</li>
          </ul>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduling && (
        <RescheduleModal
          isOpen={isRescheduling}
          onClose={() => setIsRescheduling(false)}
          appointment={appointment}
          doctor={doctor}
          getAvailableSlots={getAvailableSlots}
          onConfirmReschedule={rescheduleAppointment}
        />
      )}
    </div>
  );
};
