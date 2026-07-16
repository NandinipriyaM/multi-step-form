export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: 'home' | 'work' | 'other';
}

export interface AccountInfo {
  username: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  acceptTerms: boolean;
  newsletter: boolean;
}

export interface FormData {
  personalInfo: PersonalInfo;
  addressInfo: AddressInfo;
  accountInfo: AccountInfo;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface StepConfig {
  path: string;
  title: string;
  description: string;
  component: React.ComponentType;
  validateStep: (data: FormData) => FormErrors;
}

export type FormStep = 'personal' | 'address' | 'account' | 'review';