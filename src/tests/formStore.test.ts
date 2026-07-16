import { useFormStore } from '../store/formStore';

describe('Form Store', () => {
  beforeEach(() => {
    useFormStore.getState().resetForm();
  });

  it('initializes with default values', () => {
    const state = useFormStore.getState();
    expect(state.currentStep).toBe('personal');
    expect(state.isSubmitting).toBe(false);
    expect(state.isSubmitted).toBe(false);
    expect(state.formData.personalInfo.firstName).toBe('');
  });

  it('updates personal info correctly', () => {
    const { updatePersonalInfo } = useFormStore.getState();
    updatePersonalInfo({ firstName: 'John', lastName: 'Doe' });
    
    const state = useFormStore.getState();
    expect(state.formData.personalInfo.firstName).toBe('John');
    expect(state.formData.personalInfo.lastName).toBe('Doe');
  });

  it('updates address info correctly', () => {
    const { updateAddressInfo } = useFormStore.getState();
    updateAddressInfo({ street: '123 Main St', city: 'New York' });
    
    const state = useFormStore.getState();
    expect(state.formData.addressInfo.street).toBe('123 Main St');
    expect(state.formData.addressInfo.city).toBe('New York');
  });

  it('updates account info correctly', () => {
    const { updateAccountInfo } = useFormStore.getState();
    updateAccountInfo({ username: 'johndoe', acceptTerms: true });
    
    const state = useFormStore.getState();
    expect(state.formData.accountInfo.username).toBe('johndoe');
    expect(state.formData.accountInfo.acceptTerms).toBe(true);
  });

  it('handles step navigation', () => {
    const { setCurrentStep } = useFormStore.getState();
    setCurrentStep('address');
    
    const state = useFormStore.getState();
    expect(state.currentStep).toBe('address');
  });

  it('validates current step correctly', () => {
    const { validateCurrentStep } = useFormStore.getState();
    const isValid = validateCurrentStep();
    
    expect(isValid).toBe(false); // Should fail as no data is filled
  });

  it('tracks touched fields', () => {
    const { touchField } = useFormStore.getState();
    touchField('firstName');
    touchField('email');
    
    const state = useFormStore.getState();
    expect(state.touchedFields.has('firstName')).toBe(true);
    expect(state.touchedFields.has('email')).toBe(true);
    expect(state.touchedFields.has('lastName')).toBe(false);
  });

  it('resets form to initial state', () => {
    const store = useFormStore.getState();
    store.updatePersonalInfo({ firstName: 'John' });
    store.setCurrentStep('address');
    store.setSubmitting(true);
    
    store.resetForm();
    
    const state = useFormStore.getState();
    expect(state.currentStep).toBe('personal');
    expect(state.formData.personalInfo.firstName).toBe('');
    expect(state.isSubmitting).toBe(false);
    expect(state.touchedFields.size).toBe(0);
  });
});