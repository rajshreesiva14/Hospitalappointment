import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loading } from './components/common/Loading';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Experiment 2 (Optimization) a & b: Code Splitting and Route-level Lazy Loading
const Home = React.lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const DoctorsPage = React.lazy(() => import('./pages/DoctorsPage').then((m) => ({ default: m.DoctorsPage })));
const DoctorDetailPage = React.lazy(() => import('./pages/DoctorDetailPage').then((m) => ({ default: m.DoctorDetailPage })));
const BookAppointmentPage = React.lazy(() => import('./pages/BookAppointmentPage').then((m) => ({ default: m.BookAppointmentPage })));
const AppointmentsPage = React.lazy(() => import('./pages/AppointmentsPage').then((m) => ({ default: m.AppointmentsPage })));
const AppointmentDetailPage = React.lazy(() => import('./pages/AppointmentDetailPage').then((m) => ({ default: m.AppointmentDetailPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const PatientDashboardLayout = React.lazy(() => import('./pages/patient/PatientDashboardLayout').then((m) => ({ default: m.PatientDashboardLayout })));
const PatientOverview = React.lazy(() => import('./pages/patient/PatientOverview').then((m) => ({ default: m.PatientOverview })));
const PatientUpcoming = React.lazy(() => import('./pages/patient/PatientUpcoming').then((m) => ({ default: m.PatientUpcoming })));
const PatientHistoryPage = React.lazy(() => import('./pages/patient/PatientHistoryPage').then((m) => ({ default: m.PatientHistoryPage })));
const PatientProfilePage = React.lazy(() => import('./pages/patient/PatientProfilePage').then((m) => ({ default: m.PatientProfilePage })));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppointmentProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
              {/* Global Navigation Header */}
              <Header />

              {/* Main Routing View with Lazy Loading Suspense */}
              <main className="flex-1" id="main-content" tabIndex="-1">
                <Suspense
                  fallback={
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <Loading message="Loading hospital medical resource..." size="lg" />
                    </div>
                  }
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/doctors" element={<DoctorsPage />} />
                    <Route path="/doctor/:id" element={<DoctorDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Appointment Routes */}
                    <Route
                      path="/book-appointment"
                      element={
                        <ProtectedRoute>
                          <BookAppointmentPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/appointments"
                      element={
                        <ProtectedRoute>
                          <AppointmentsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/appointment/:id"
                      element={
                        <ProtectedRoute>
                          <AppointmentDetailPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Nested Patient Dashboard Routes */}
                    <Route
                      path="/patient"
                      element={
                        <ProtectedRoute allowedRoles={['patient', 'admin']}>
                          <PatientDashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<PatientOverview />} />
                      <Route path="appointments" element={<AppointmentsPage />} />
                      <Route path="upcoming" element={<PatientUpcoming />} />
                      <Route path="history" element={<PatientHistoryPage />} />
                      <Route path="profile" element={<PatientProfilePage />} />
                    </Route>

                    {/* Protected Hospital Administration Route */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback 404 Route */}
                    <Route
                      path="*"
                      element={
                        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
                          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl font-black">
                            404
                          </div>
                          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
                          <p className="text-xs text-slate-500">
                            The hospital web resource you requested does not exist or has moved.
                          </p>
                          <a
                            href="/"
                            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
                          >
                            Return to Home
                          </a>
                        </div>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>

              {/* Global Hospital Footer */}
              <Footer />
            </div>
          </BrowserRouter>
        </AppointmentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
