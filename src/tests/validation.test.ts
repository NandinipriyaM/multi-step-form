import {
  validatePersonalInfo,
  validateAddressInfo,
  validateAccountInfo,
  validateForm,
  isStepValid,
} from '../utils/validation';
import { PersonalInfo, AddressInfo, AccountInfo, FormData } from '../types/form';

describe('Validation Functions', () => {
  describe('validatePersonalInfo', () => {
    it('returns errors for empty fields', () => {
      const data: PersonalInfo = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
      };
      
      const errors = validatePersonalInfo(data);
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.phone).toBeDefined();
      expect(errors.dateOfBirth).toBeDefined();
      expect(errors.gender).toBeDefined();
    });

    it('validates email format', () => {
      const data: PersonalInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male',
      };
      
      const errors = validatePersonalInfo(data);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('validates age requirement', () => {
      const data: PersonalInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '2020-01-01',
        gender: 'male',
      };
      
      const errors = validatePersonalInfo(data);
      expect(errors.dateOfBirth).toBe('You must be at least 18 years old');
    });

    it('passes with valid data', () => {
      const data: PersonalInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male',
      };
      
      const errors = validatePersonalInfo(data);
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('validateAddressInfo', () => {
    it('returns errors for empty fields', () => {
      const data: AddressInfo = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        addressType: 'home',
      };
      
      const errors = validateAddressInfo(data);
      expect(errors.street).toBeDefined();
      expect(errors.city).toBeDefined();
      expect(errors.state).toBeDefined();
      expect(errors.zipCode).toBeDefined();
      expect(errors.country).toBeDefined();
    });

    it('validates ZIP code format', () => {
      const data: AddressInfo = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: 'invalid',
        country: 'United States',
        addressType: 'home',
      };
      
      const errors = validateAddressInfo(data);
      expect(errors.zipCode).toContain('valid ZIP code');
    });

    it('accepts valid ZIP codes', () => {
      const data: AddressInfo = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        addressType: 'home',
      };
      
      const errors = validateAddressInfo(data);
      expect(errors.zipCode).toBeUndefined();
    });
  });

  describe('validateAccountInfo', () => {
    it('validates password strength', () => {
      const data: AccountInfo = {
        username: 'johndoe',
        password: 'weak',
        confirmPassword: 'weak',
        securityQuestion: 'What is your pet?',
        securityAnswer: 'Buddy',
        acceptTerms: true,
        newsletter: false,
      };
      
      const errors = validateAccountInfo(data);
      expect(errors.password).toContain('at least 8 characters');
    });

    it('validates password match', () => {
      const data: AccountInfo = {
        username: 'johndoe',
        password: 'StrongP@ss1',
        confirmPassword: 'DifferentP@ss1',
        securityQuestion: 'What is your pet?',
        securityAnswer: 'Buddy',
        acceptTerms: true,
        newsletter: false,
      };
      
      const errors = validateAccountInfo(data);
      expect(errors.confirmPassword).toBe('Passwords do not match');
    });

    it('requires terms acceptance', () => {
      const data: AccountInfo = {
        username: 'johndoe',
        password: 'StrongP@ss1',
        confirmPassword: 'StrongP@ss1',
        securityQuestion: 'What is your pet?',
        securityAnswer: 'Buddy',
        acceptTerms: false,
        newsletter: false,
      };
      
      const errors = validateAccountInfo(data);
      expect(errors.acceptTerms).toBeDefined();
    });

    it('validates username format', () => {
      const data: AccountInfo = {
        username: 'ab',
        password: 'StrongP@ss1',
        confirmPassword: 'StrongP@ss1',
        securityQuestion: 'What is your pet?',
        securityAnswer: 'Buddy',
        acceptTerms: true,
        newsletter: false,
      };
      
      const errors = validateAccountInfo(data);
      expect(errors.username).toContain('3-20 characters');
    });
  });

  describe('validateForm', () => {
    it('validates personal step', () => {
      const formData: FormData = {
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
        },
        addressInfo: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          addressType: 'home',
        },
        accountInfo: {
          username: '',
          password: '',
          confirmPassword: '',
          securityQuestion: '',
          securityAnswer: '',
          acceptTerms: false,
          newsletter: false,
        },
      };
      
      const errors = validateForm(formData, 'personal');
      expect(errors.firstName).toBeDefined();
    });

    it('returns empty object for invalid step', () => {
      const formData: FormData = {
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
        },
        addressInfo: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          addressType: 'home',
        },
        accountInfo: {
          username: '',
          password: '',
          confirmPassword: '',
          securityQuestion: '',
          securityAnswer: '',
          acceptTerms: false,
          newsletter: false,
        },
      };
      
      const errors = validateForm(formData, 'invalid-step');
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('isStepValid', () => {
    it('returns true for empty errors', () => {
      expect(isStepValid({})).toBe(true);
    });

    it('returns false when errors exist', () => {
      expect(isStepValid({ field: 'error' })).toBe(false);
    });
  });
});