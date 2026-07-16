import { FormData, FormErrors, PersonalInfo, AddressInfo, AccountInfo } from '../types/form';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone validation regex (US format)
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
// ZIP code validation regex
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Username validation regex
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

export const validatePersonalInfo = (data: PersonalInfo): FormErrors => {
  const errors: FormErrors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = 'First name must be less than 50 characters';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = 'Last name must be less than 50 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_REGEX.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid US phone number';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      errors.dateOfBirth = 'You must be at least 18 years old';
    } else if (age > 120) {
      errors.dateOfBirth = 'Please enter a valid date of birth';
    }
  }

  if (!data.gender) {
    errors.gender = 'Gender is required';
  }

  return errors;
};

export const validateAddressInfo = (data: AddressInfo): FormErrors => {
  const errors: FormErrors = {};

  if (!data.street?.trim()) {
    errors.street = 'Street address is required';
  } else if (data.street.trim().length < 5) {
    errors.street = 'Street address must be at least 5 characters';
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!data.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!data.zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!ZIP_REGEX.test(data.zipCode)) {
    errors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
  }

  if (!data.country?.trim()) {
    errors.country = 'Country is required';
  }

  if (!data.addressType) {
    errors.addressType = 'Address type is required';
  }

  return errors;
};

export const validateAccountInfo = (data: AccountInfo): FormErrors => {
  const errors: FormErrors = {};

  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  } else if (!USERNAME_REGEX.test(data.username)) {
    errors.username = 'Username must be 3-20 characters and contain only letters, numbers, hyphens, or underscores';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!PASSWORD_REGEX.test(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.securityQuestion?.trim()) {
    errors.securityQuestion = 'Security question is required';
  }

  if (!data.securityAnswer?.trim()) {
    errors.securityAnswer = 'Security answer is required';
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }

  return errors;
};

export const validateForm = (data: FormData, step: string): FormErrors => {
  switch (step) {
    case 'personal':
      return validatePersonalInfo(data.personalInfo);
    case 'address':
      return validateAddressInfo(data.addressInfo);
    case 'account':
      return validateAccountInfo(data.accountInfo);
    default:
      return {};
  }
};

export const isStepValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};