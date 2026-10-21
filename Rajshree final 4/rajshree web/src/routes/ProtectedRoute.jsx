import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common/Loading';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page and preserve the destination url in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if specific roles are required
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user?.role))) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-amber-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
          <p className="text-sm text-slate-600">
            This section is reserved for {allowedRoles.join(' or ')} accounts. You are currently logged in as a <span className="font-semibold capitalize text-teal-600">{user?.role || 'user'}</span>.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
