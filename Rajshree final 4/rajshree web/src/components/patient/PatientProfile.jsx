import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateEmail, validatePhone } from '../../utils/validators';
import { User, Mail, Phone, Heart, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const PatientProfile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Sampath Kumar',
    email: user?.email || 'rajshree.patient@health.org',
    phone: user?.phone || '9876543210',
    patientId: user?.patientId || 'PT-1001',
    age: user?.age || '32',
    gender: user?.gender || 'Male',
    bloodGroup: user?.bloodGroup || 'O+',
    emergencyContact: user?.emergencyContact || '9876543299',
    address: user?.address || '45-A, Metro Enclave, New Delhi',
    medicalHistory: user?.medicalHistory || 'Mild seasonal allergic rhinitis, No known drug allergies'
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Patient name is required.';
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updateProfile(formData);
      setSuccessMessage('Patient profile successfully updated!');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Patient Electronic Health Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal data, medical records, and emergency contact details.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient ID: {formData.patientId}</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Legal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            icon={User}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
            icon={Mail}
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            required
            icon={Phone}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age (Years)"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
            />

            <div className="space-y-1 text-left">
              <label className="block text-sm font-semibold text-slate-700">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-slate-700">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Emergency Contact Number"
            type="tel"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            icon={Phone}
            hint="Immediate family member or guardian"
          />
        </div>

        <Input
          label="Residential Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <div className="space-y-1 text-left">
          <label className="block text-sm font-semibold text-slate-700">
            Known Medical Conditions / Drug Allergies
          </label>
          <textarea
            rows="3"
            value={formData.medicalHistory}
            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          ></textarea>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
