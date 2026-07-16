import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { FormLayout } from '../FormLayout';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateAccountInfo } from '../../utils/validation';
import { checkUsernameAvailability } from '../../utils/api';

export const AccountInfo: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    updateAccountInfo,
    setErrors,
    touchField,
    touchedFields,
  } = useFormStore();

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const handleChange = useCallback(
    (field: keyof typeof formData.accountInfo) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : e.target.value;
        updateAccountInfo({ [field]: value });
        touchField(field);

        const currentErrors = useFormStore.getState().errors;
        if (currentErrors[field]) {
          const newErrors = { ...currentErrors };
          delete newErrors[field];
          setErrors(newErrors);
        }
      },
    [updateAccountInfo, touchField, setErrors]
  );

  const handleUsernameBlur = useCallback(async () => {
    const currentFormData = useFormStore.getState().formData;
    const currentErrors = useFormStore.getState().errors;
    const username = currentFormData.accountInfo.username;
    
    if (username && !currentErrors.username) {
      setIsCheckingUsername(true);
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameAvailable(isAvailable);
        if (!isAvailable) {
          setErrors({ ...currentErrors, username: 'This username is already taken' });
        }
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setIsCheckingUsername(false);
      }
    }
  }, [setErrors]);

  const handleBack = useCallback(() => {
    navigate('/form/address');
  }, [navigate]);

  const handleNext = useCallback(() => {
    const currentFormData = useFormStore.getState().formData;
    const stepErrors = validateAccountInfo(currentFormData.accountInfo);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      navigate('/form/review');
    }
  }, [setErrors, navigate]);

  const securityQuestions = [
    { value: '', label: 'Select a security question' },
    { value: 'pet-name', label: 'What was the name of your first pet?' },
    { value: 'mother-maiden', label: "What is your mother's maiden name?" },
    { value: 'first-car', label: 'What was your first car?' },
    { value: 'birth-city', label: 'In what city were you born?' },
    { value: 'school-name', label: 'What was the name of your elementary school?' },
  ];

  return (
    <FormLayout
      title="Account Setup"
      description="Create your account credentials."
      currentStep="account"
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Username"
            required
            value={formData.accountInfo.username}
            onChange={handleChange('username')}
            onBlur={handleUsernameBlur}
            error={touchedFields.has('username') ? errors.username : undefined}
            showError={touchedFields.has('username')}
            placeholder="johndoe123"
            autoComplete="username"
            isLoading={isCheckingUsername}
          />
          {usernameAvailable !== null && !errors.username && (
            <p className={`text-sm mt-1 ${usernameAvailable ? 'text-success-600' : 'text-error-600'}`}>
              {usernameAvailable ? '✓ Username is available' : '✗ Username is taken'}
            </p>
          )}
        </div>

        <Input
          label="Password"
          type="password"
          required
          value={formData.accountInfo.password}
          onChange={handleChange('password')}
          error={touchedFields.has('password') ? errors.password : undefined}
          showError={touchedFields.has('password')}
          placeholder="••••••••"
          autoComplete="new-password"
          helperText="Must be 8+ characters with uppercase, lowercase, number, and special character"
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          value={formData.accountInfo.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={touchedFields.has('confirmPassword') ? errors.confirmPassword : undefined}
          showError={touchedFields.has('confirmPassword')}
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <Select
          label="Security Question"
          required
          value={formData.accountInfo.securityQuestion}
          onChange={handleChange('securityQuestion')}
          options={securityQuestions}
          error={touchedFields.has('securityQuestion') ? errors.securityQuestion : undefined}
          showError={touchedFields.has('securityQuestion')}
        />

        <Input
          label="Security Answer"
          required
          value={formData.accountInfo.securityAnswer}
          onChange={handleChange('securityAnswer')}
          error={touchedFields.has('securityAnswer') ? errors.securityAnswer : undefined}
          showError={touchedFields.has('securityAnswer')}
          placeholder="Your answer"
        />

        <div className="space-y-2">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.accountInfo.acceptTerms}
              onChange={handleChange('acceptTerms')}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              aria-describedby="terms-error"
            />
            <span className="ml-2 text-sm text-gray-700">
              I accept the{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 underline"
                onClick={() => alert('Terms and Conditions will open here')}
              >
                Terms and Conditions
              </button>
              {' '}and{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 underline"
                onClick={() => alert('Privacy Policy will open here')}
              >
                Privacy Policy
              </button>
              <span className="text-error-500 ml-1">*</span>
            </span>
          </label>
          {touchedFields.has('acceptTerms') && errors.acceptTerms && (
            <p id="terms-error" className="error-message" role="alert">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.accountInfo.newsletter}
            onChange={handleChange('newsletter')}
            className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Subscribe to our newsletter for updates and special offers
          </span>
        </label>

        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={handleBack}>
            Previous
          </Button>
          <Button onClick={handleNext} dataTestId="account-next-btn">
            Review
          </Button>
        </div>
      </div>
    </FormLayout>
  );
};