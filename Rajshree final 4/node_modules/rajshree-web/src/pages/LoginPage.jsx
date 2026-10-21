import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  ShieldCheck,
  Mail,
  Lock,
  HeartPulse,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  UserPlus,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail, validatePassword, validatePatientId, validatePhone } from '../utils/validators';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, isAdmin } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Tab: 'patient' or 'admin'
  const [activeTab, setActiveTab] = useState('patient');

  // Password visibility toggles
  const [showPatientPassword, setShowPatientPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Patient Login Form state
  const [patientForm, setPatientForm] = useState({
    loginIdentifier: 'rajshree.patient@health.org',
    password: 'Patient@123',
    patientId: 'PT-1001'
  });

  // Admin Login Form state
  const [adminForm, setAdminForm] = useState({
    email: 'admin@rajshree.org',
    password: 'Admin@123',
    adminPin: '4197'
  });

  // Mode for New User Registration / Create Account
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+'
  });
  const [registerSuccess, setRegisterSuccess] = useState('');

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Quick Demo fill helpers
  const handleQuickPatientDemo = () => {
    setActiveTab('patient');
    setIsRegistering(false);
    setPatientForm({
      loginIdentifier: 'rajshree.patient@health.org',
      password: 'Patient@123',
      patientId: 'PT-1001'
    });
    setErrors({});
  };

  const handleQuickAdminDemo = () => {
    setActiveTab('admin');
    setIsRegistering(false);
    setAdminForm({
      email: 'admin@rajshree.org',
      password: 'Admin@123',
      adminPin: '4197'
    });
    setErrors({});
  };

  // Patient Registration / Create Account Submission for all new users
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!registerForm.name.trim()) {
      newErrors.regName = 'Patient full legal name is required.';
    } else if (registerForm.name.trim().length < 2) {
      newErrors.regName = 'Name must be at least 2 characters.';
    }

    const emailErr = validateEmail(registerForm.email);
    if (emailErr) newErrors.regEmail = emailErr;

    const phoneErr = validatePhone(registerForm.phone);
    if (phoneErr) newErrors.regPhone = phoneErr;

    const passErr = validatePassword(registerForm.password);
    if (passErr) newErrors.regPassword = passErr;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const newUser = {
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        phone: registerForm.phone.trim(),
        age: Number(registerForm.age) || 28,
        gender: registerForm.gender || 'Male',
        bloodGroup: registerForm.bloodGroup || 'O+',
        password: registerForm.password,
        role: 'patient'
      };

      // Register securely via API & Token management
      await register(newUser);

      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Please check your details.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Patient Login Submission with dynamic user lookup (Experiment 4 f)
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate identifier (email or patient ID)
    const cleanIdentifier = patientForm.loginIdentifier.trim();
    if (!cleanIdentifier) {
      newErrors.loginIdentifier = 'Email address or Patient ID is required.';
    } else if (cleanIdentifier.includes('@')) {
      const emailErr = validateEmail(cleanIdentifier);
      if (emailErr) newErrors.loginIdentifier = emailErr;
    } else {
      const idErr = validatePatientId(cleanIdentifier);
      if (idErr) newErrors.loginIdentifier = idErr;
    }

    // Validate password complexity
    const passErr = validatePassword(patientForm.password);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await login(
        {
          loginIdentifier: cleanIdentifier,
          email: cleanIdentifier.includes('@') ? cleanIdentifier : undefined,
          patientId: !cleanIdentifier.includes('@') ? cleanIdentifier : undefined,
          password: patientForm.password,
          role: 'patient'
        },
        'patient'
      );

      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Login failed. Please verify credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login Submission
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailErr = validateEmail(adminForm.email);
    if (emailErr) newErrors.email = emailErr;

    if (!adminForm.password || adminForm.password.length < 6) {
      newErrors.password = 'Admin master security password is required.';
    }

    if (!adminForm.adminPin || adminForm.adminPin.length < 4) {
      newErrors.adminPin = '4-digit hospital security PIN is required.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await login(
        {
          name: 'Dr. Suresh Bansal (Medical Superintendent)',
          email: adminForm.email,
          role: 'admin',
          staffId: 'ADMIN-882',
          adminPin: adminForm.adminPin
        },
        'admin'
      );

      // Redirect to admin dashboard
      navigate('/admin', { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Admin authentication failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full space-y-8">
        {/* Brand Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/25">
            <HeartPulse className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rajshree Medical Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Unified authentication for Patients and Hospital Administration
            </p>
          </div>
        </div>

        {/* Tab Toggle: Patient Login vs Admin Login */}
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveTab('patient');
              setIsRegistering(false);
              setErrors({});
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'patient'
                ? 'bg-white text-teal-800 shadow-md scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>Patient Portal Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrors({});
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-white shadow-md scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Hospital Admin Access</span>
          </button>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="bg-teal-50/70 border border-teal-200/80 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-teal-900 font-medium">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Quick Testing? One-click fill demo accounts:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickPatientDemo}
              className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-[11px] hover:bg-teal-700 transition"
            >
              Demo Patient
            </button>
            <button
              type="button"
              onClick={handleQuickAdminDemo}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-[11px] hover:bg-slate-900 transition"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl">
          {errors.form && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* PATIENT LOGIN FORM */}
          {activeTab === 'patient' && !isRegistering && (
            <form onSubmit={handlePatientSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800">
                  Patient Health Records Sign In
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your registered Patient ID or Email to access your doctor consultations.
                </p>
              </div>

              <Input
                label="Email Address or Patient ID"
                placeholder="e.g. rajshree.patient@health.org or PT-1001"
                value={patientForm.loginIdentifier}
                autoComplete="username"
                onChange={(e) =>
                  setPatientForm({ ...patientForm, loginIdentifier: e.target.value })
                }
                error={errors.loginIdentifier}
                required
                icon={Mail}
                hint="Accepted formats: name@domain.com or PT-XXXX"
              />

              <Input
                label="Account Password"
                type={showPatientPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                value={patientForm.password}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, password: e.target.value })
                }
                error={errors.password}
                required
                icon={Lock}
                hint="Must be ≥8 characters with uppercase, number & symbol"
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPatientPassword(!showPatientPassword)}
                    aria-label={showPatientPassword ? 'Hide password' : 'Show password'}
                    className="text-slate-400 hover:text-slate-600 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                  >
                    {showPatientPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full shadow-lg shadow-teal-500/20"
                >
                  Sign In as Patient
                </Button>
              </div>

              {/* Create an Account Button for All New Users */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  New patient to Rajshree Multispeciality Hospital?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrors({});
                  }}
                  icon={UserPlus}
                  className="w-full border-teal-500 text-teal-700 hover:bg-teal-50 font-bold"
                >
                  Create an Account (New Patient)
                </Button>
              </div>
            </form>
          )}

          {/* CREATE AN ACCOUNT FORM FOR NEW USERS */}
          {activeTab === 'patient' && isRegistering && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Create New Patient Account
                  </h2>
                  <p className="text-xs text-slate-500">
                    Register with your real name to display in the header and on appointment slips.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                  New Patient
                </span>
              </div>

              <Input
                label="Full Legal Name"
                placeholder="e.g. Rajshree S"
                value={registerForm.name}
                autoComplete="name"
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                error={errors.regName}
                required
                icon={User}
                hint="Your actual patient name displayed in header & appointments"
              />

              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                error={errors.regEmail}
                required
                icon={Mail}
              />

              <Input
                label="Phone Number"
                type="tel"
                autoComplete="tel"
                placeholder="10-digit mobile number"
                value={registerForm.phone}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, phone: e.target.value })
                }
                error={errors.regPhone}
                required
                icon={Phone}
              />

              <Input
                label="Account Password"
                type={showRegisterPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                error={errors.regPassword}
                required
                icon={Lock}
                hint="Must be ≥8 characters with uppercase, number & symbol"
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    className="text-slate-400 hover:text-slate-600 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Age"
                  type="number"
                  placeholder="28"
                  value={registerForm.age}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, age: e.target.value })
                  }
                />

                <div className="space-y-1 text-left">
                  <label className="block text-sm font-semibold text-slate-700">Gender</label>
                  <select
                    value={registerForm.gender}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, gender: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="block text-sm font-semibold text-slate-700">Blood</label>
                  <select
                    value={registerForm.bloodGroup}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, bloodGroup: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  icon={UserPlus}
                  iconPosition="right"
                  className="w-full shadow-lg shadow-teal-500/20"
                >
                  Create Account & Sign In
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setErrors({});
                    }}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline underline-offset-4"
                  >
                    Already have an account? Sign In instead
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ADMIN LOGIN FORM */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800">
                  Hospital Administration & Management Desk
                </h2>
                <p className="text-xs text-slate-500">
                  Authorised medical superintendents, scheduling coordinators, and billing auditors.
                </p>
              </div>

              <Input
                label="Hospital Administrator Email"
                type="email"
                autoComplete="username"
                placeholder="admin@rajshree.org"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                error={errors.email}
                required
                icon={Mail}
              />

              <Input
                label="Master Security Password"
                type={showAdminPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                error={errors.password}
                required
                icon={Lock}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                    className="text-slate-400 hover:text-slate-600 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Input
                label="4-Digit Security PIN"
                type="password"
                autoComplete="one-time-code"
                maxLength={4}
                placeholder="4197"
                value={adminForm.adminPin}
                onChange={(e) => setAdminForm({ ...adminForm, adminPin: e.target.value })}
                error={errors.adminPin}
                required
                icon={KeyRound}
                hint="Hospital intranet token PIN"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  isLoading={isLoading}
                  icon={ShieldCheck}
                  iconPosition="right"
                  className="w-full bg-slate-900 hover:bg-slate-800"
                >
                  Authorize Admin Access
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Continue to Hospital Portal as Guest */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline underline-offset-4 transition"
          >
            Continue to Hospital Portal as Guest →
          </button>
        </div>
      </div>
    </div>
  );
};
