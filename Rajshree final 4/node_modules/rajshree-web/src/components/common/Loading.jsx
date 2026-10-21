import React from 'react';

export const Loading = ({
  message = 'Loading hospital information...',
  fullScreen = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-teal-200 border-t-teal-600 animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse"></div>
        </div>
      </div>
      {message && (
        <p className="text-sm font-medium text-slate-600 animate-pulse tracking-wide">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 max-w-sm w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
