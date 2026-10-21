import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      endAdornment,
      type = 'text',
      id,
      name,
      value,
      onChange,
      placeholder,
      required = false,
      disabled = false,
      className = '',
      wrapperClassName = '',
      autoComplete,
      min,
      max,
      step,
      pattern,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || Math.random().toString(36).substring(7);

    return (
      <div className={`flex flex-col text-left space-y-1 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        {hint && (
          <span id={`${inputId}-hint`} className="text-xs text-slate-500 mb-1">
            {hint}
          </span>
        )}

        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-5 w-5" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            aria-describedby={
              [hint ? `${inputId}-hint` : '', error ? `${inputId}-error` : '']
                .filter(Boolean)
                .join(' ') || undefined
            }
            aria-invalid={error ? 'true' : 'false'}
            className={`block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-150 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
              Icon ? 'pl-11' : ''
            } ${endAdornment ? 'pr-11' : ''} ${error ? '!border-red-500 !bg-red-50/50 focus:!ring-red-200' : ''} ${className}`}
            {...props}
          />

          {endAdornment && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {endAdornment}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium animate-fadeIn"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
