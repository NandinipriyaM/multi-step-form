import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { FormLayout } from '../FormLayout';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validatePersonalInfo } from '../../utils/validation';

export const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    updatePersonalInfo,
    setErrors,
    touchField,
    touchedFields,
  } = useFormStore();

  const handleChange = useCallback(
    (field: keyof typeof formData.personalInfo) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        updatePersonalInfo({ [field]: value });
        touchField(field);

        // Clear error when user starts typing
        const currentErrors = useFormStore.getState().errors;
        if (currentErrors[field]) {
          const newErrors = { ...currentErrors };
          delete newErrors[field];
          setErrors(newErrors);
        }
      },
    [updatePersonalInfo, touchField, setErrors]
  );

  const handleNext = useCallback(() => {
    const currentFormData = useFormStore.getState().formData;
    const stepErrors = validatePersonalInfo(currentFormData.personalInfo);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      navigate('/form/address');
    }
  }, [setErrors, navigate]);

  const genderOptions = [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  return (
    <FormLayout
      title="Personal Information"
      description="Please provide your basic personal information."
      currentStep="personal"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            required
            value={formData.personalInfo.firstName}
            onChange={handleChange('firstName')}
            error={touchedFields.has('firstName') ? errors.firstName : undefined}
            showError={touchedFields.has('firstName')}
            placeholder="John"
            autoComplete="given-name"
          />
          
          <Input
            label="Last Name"
            required
            value={formData.personalInfo.lastName}
            onChange={handleChange('lastName')}
            error={touchedFields.has('lastName') ? errors.lastName : undefined}
            showError={touchedFields.has('lastName')}
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          required
          value={formData.personalInfo.email}
          onChange={handleChange('email')}
          error={touchedFields.has('email') ? errors.email : undefined}
          showError={touchedFields.has('email')}
          placeholder="john.doe@example.com"
          autoComplete="email"
        />

        <Input
          label="Phone Number"
          type="tel"
          required
          value={formData.personalInfo.phone}
          onChange={handleChange('phone')}
          error={touchedFields.has('phone') ? errors.phone : undefined}
          showError={touchedFields.has('phone')}
          placeholder="(123) 456-7890"
          autoComplete="tel"
          helperText="Enter your US phone number"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date of Birth"
            type="date"
            required
            value={formData.personalInfo.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
            error={touchedFields.has('dateOfBirth') ? errors.dateOfBirth : undefined}
            showError={touchedFields.has('dateOfBirth')}
          />

          <Select
            label="Gender"
            required
            value={formData.personalInfo.gender}
            onChange={handleChange('gender')}
            options={genderOptions}
            error={touchedFields.has('gender') ? errors.gender : undefined}
            showError={touchedFields.has('gender')}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} dataTestId="personal-next-btn">
            Next Step
          </Button>
        </div>
      </div>
    </FormLayout>
  );
};