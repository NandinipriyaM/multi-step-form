import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  showError?: boolean;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, showError = true, isLoading = false, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="mb-4">
        <label htmlFor={inputId} className="label-text">
          {label}
          {props.required && (
            <span className="text-error-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`input-field ${error && showError ? 'border-error-500' : ''} ${className}`}
            aria-invalid={error && showError ? 'true' : 'false'}
            aria-describedby={`${error && showError ? errorId : ''} ${helperText ? helperId : ''}`}
            {...props}
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>

        {showError && error && (
          <p id={errorId} className="error-message" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-gray-500 text-sm mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';