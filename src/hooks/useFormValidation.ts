import { useState, useCallback } from 'react';
import { FormErrors } from '../types/form';
import { checkUsernameAvailability } from '../utils/api';

interface UseFormValidationReturn {
  errors: FormErrors;
  isChecking: boolean;
  validateField: (field: string, value: any, formData?: any) => Promise<string | undefined>;
  validateAsync: (field: string, value: string) => Promise<string | undefined>;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

export const useFormValidation = (initialErrors: FormErrors = {}): UseFormValidationReturn => {
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [isChecking, setIsChecking] = useState(false);

  const validateField = useCallback(async (
    field: string,
    value: any,
    formData?: any
  ): Promise<string | undefined> => {
    let error: string | undefined;

    // Synchronous validation rules
    switch (field) {
      case 'firstName':
        if (!value?.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;

      case 'lastName':
        if (!value?.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value?.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value?.trim()) {
          error = 'Phone number is required';
        } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          error = 'Date of birth is required';
        } else {
          const dob = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (age < 18) {
            error = 'You must be at least 18 years old';
          }
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
          error = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (formData?.password && value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'username':
        if (!value?.trim()) {
          error = 'Username is required';
        } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(value)) {
          error = 'Username must be 3-20 characters and contain only letters, numbers, hyphens, or underscores';
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error;
  }, []);

  const validateAsync = useCallback(async (
    field: string,
    value: string
  ): Promise<string | undefined> => {
    setIsChecking(true);
    let error: string | undefined;

    try {
      if (field === 'username' && value.trim()) {
        const isAvailable = await checkUsernameAvailability(value);
        if (!isAvailable) {
          error = 'This username is already taken';
        }
      }
    } catch (err) {
      console.error('Async validation error:', err);
      error = 'Unable to validate. Please try again.';
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    setIsChecking(false);
    return error;
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    isChecking,
    validateField,
    validateAsync,
    clearError,
    clearAllErrors,
  };
};