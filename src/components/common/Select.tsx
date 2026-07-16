import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  showError?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, showError = true, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="mb-4">
        <label htmlFor={selectId} className="label-text">
          {label}
          {props.required && (
            <span className="text-error-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>
        
        <select
          ref={ref}
          id={selectId}
          className={`input-field ${error && showError ? 'border-error-500' : ''} ${className}`}
          aria-invalid={error && showError ? 'true' : 'false'}
          aria-describedby={`${error && showError ? errorId : ''} ${helperText ? helperId : ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';