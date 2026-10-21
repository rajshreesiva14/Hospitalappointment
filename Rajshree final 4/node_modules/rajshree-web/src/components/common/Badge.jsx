import React from 'react';

export const Badge = ({ children, variant = 'teal', size = 'sm', className = '' }) => {
  const variants = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${variants[variant] || variants.teal} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};
