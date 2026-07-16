import { create } from 'zustand';
import { FormData, FormErrors, FormStep } from '../types/form';
import { validateForm, isStepValid } from '../utils/validation';

interface FormState {
  currentStep: FormStep;
  formData: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
  touchedFields: Set<string>;
  
  setCurrentStep: (step: FormStep) => void;
  updatePersonalInfo: (data: Partial<FormData['personalInfo']>) => void;
  updateAddressInfo: (data: Partial<FormData['addressInfo']>) => void;
  updateAccountInfo: (data: Partial<FormData['accountInfo']>) => void;
  setErrors: (errors: FormErrors) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitted: (isSubmitted: boolean) => void;
  touchField: (field: string) => void;
  validateCurrentStep: () => boolean;
  canProceedToNextStep: () => boolean;
  resetForm: () => void;
}

const initialFormData: FormData = {
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
    country: 'United States',
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

export const useFormStore = create<FormState>((set, get) => ({
  currentStep: 'personal',
  formData: initialFormData,
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  touchedFields: new Set<string>(),

  setCurrentStep: (step: FormStep) => {
    set({ currentStep: step });
  },

  updatePersonalInfo: (data: Partial<FormData['personalInfo']>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        personalInfo: {
          ...state.formData.personalInfo,
          ...data,
        },
      },
    }));
  },

  updateAddressInfo: (data: Partial<FormData['addressInfo']>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        addressInfo: {
          ...state.formData.addressInfo,
          ...data,
        },
      },
    }));
  },

  updateAccountInfo: (data: Partial<FormData['accountInfo']>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        accountInfo: {
          ...state.formData.accountInfo,
          ...data,
        },
      },
    }));
  },

  setErrors: (errors: FormErrors) => {
    set({ errors });
  },

  setSubmitting: (isSubmitting: boolean) => {
    set({ isSubmitting });
  },

  setSubmitted: (isSubmitted: boolean) => {
    set({ isSubmitted });
  },

  touchField: (field: string) => {
    set((state) => {
      const newTouched = new Set(Array.from(state.touchedFields));
      newTouched.add(field);
      return { touchedFields: newTouched };
    });
  },

  validateCurrentStep: () => {
    const { currentStep, formData } = get();
    const errors = validateForm(formData, currentStep);
    set({ errors });
    return isStepValid(errors);
  },

  canProceedToNextStep: () => {
    const { currentStep, formData } = get();
    const errors = validateForm(formData, currentStep);
    return isStepValid(errors);
  },

  resetForm: () => {
    set({
      currentStep: 'personal',
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
      isSubmitted: false,
      touchedFields: new Set<string>(),
    });
  },
}));