import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  Stethoscope
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const AppointmentCard = ({
  appointment,
  onReschedule,
  onCancel,
  showActions = true
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="emerald" size="sm">Confirmed</Badge>;
      case 'Rescheduled':
        return <Badge variant="blue" size="sm">Rescheduled</Badge>;
      case 'Completed':
        return <Badge variant="slate" size="sm">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="rose" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="teal" size="sm">{status}</Badge>;
    }
  };

  const isCancellable =
    appointment.status === 'Confirmed' || appointment.status === 'Rescheduled';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4">
      {/* Header: ID & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {appointment.id}
          </span>
          <span className="text-xs text-slate-400">
            Booked on {new Date(appointment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div>{getStatusBadge(appointment.status)}</div>
      </div>

      {/* Doctor & Patient Info Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center border border-teal-100 shrink-0 shadow-sm">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1 space-y-1">
          <Link
            to={`/doctor/${appointment.doctorId}`}
            className="text-base font-bold text-slate-900 hover:text-teal-600 transition"
          >
            {appointment.doctorName}
          </Link>
          <p className="text-xs font-medium text-teal-700">
            {appointment.doctorSpecialty}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {appointment.room}
          </p>
        </div>

        {/* Date & Time pill */}
        <div className="w-full sm:w-auto bg-teal-50/70 border border-teal-100 p-3 rounded-2xl text-left sm:text-right shrink-0">
          <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-teal-900">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center sm:justify-end gap-1.5 text-xs font-medium text-teal-700 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-cyan-600" />
            <span>{appointment.timeSlot} ({appointment.duration || '30 mins'})</span>
          </div>
        </div>
      </div>

      {/* Patient details & fees */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span>
            Patient: <strong className="text-slate-800">{appointment.patientName}</strong> ({appointment.patientGender}, {appointment.patientAge}y)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">
            Fee: ₹{appointment.consultationFee}
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {appointment.paymentStatus || 'Paid'}
          </span>
        </div>
      </div>

      {appointment.cancellationReason && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
          <strong>Cancellation Reason:</strong> {appointment.cancellationReason}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <Link
            to={`/appointment/${appointment.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-600 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            View Summary / Slip
          </Link>

          <div className="flex items-center gap-2">
            {isCancellable && onReschedule && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReschedule(appointment)}
                icon={RotateCcw}
              >
                Reschedule
              </Button>
            )}

            {isCancellable && onCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel(appointment)}
                icon={XCircle}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
