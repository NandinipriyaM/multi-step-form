import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { FormLayout } from '../FormLayout';
import { Button } from '../common/Button';
import { submitForm } from '../../utils/api';

export const Review: React.FC = () => {
  const navigate = useNavigate();
  const { formData, isSubmitting, isSubmitted, setSubmitting, setSubmitted, resetForm } =
    useFormStore();

  const handleBack = useCallback(() => {
    navigate('/form/account');
  }, [navigate]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      await submitForm(formData);
      setSubmitted(true);
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [formData, setSubmitting, setSubmitted, resetForm, navigate]);

  if (isSubmitted) {
    return (
      <FormLayout
        title="Submission Successful"
        description="Your registration has been completed."
        currentStep="review"
      >
        <div className="text-center py-8">
          <svg
            className="mx-auto h-16 w-16 text-success-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Registration Complete!
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for registering. You will be redirected shortly.
          </p>
        </div>
      </FormLayout>
    );
  }

  const renderSection = (title: string, data: Record<string, any>) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {typeof value === 'boolean' 
                ? value ? 'Yes' : 'No'
                : value || 'Not provided'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <FormLayout
      title="Review Your Information"
      description="Please review your information before submitting."
      currentStep="review"
    >
      <div className="space-y-6">
        {renderSection('Personal Information', formData.personalInfo)}
        {renderSection('Address Information', formData.addressInfo)}
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Account Information
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.accountInfo.username || 'Not provided'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Password</dt>
              <dd className="mt-1 text-sm text-gray-900">••••••••</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Security Question</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.accountInfo.securityQuestion || 'Not provided'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Security Answer</dt>
              <dd className="mt-1 text-sm text-gray-900">••••••••</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Accepted Terms</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.accountInfo.acceptTerms ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Newsletter</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.accountInfo.newsletter ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={handleBack}>
            Previous
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            dataTestId="submit-form-btn"
          >
            Submit Registration
          </Button>
        </div>
      </div>
    </FormLayout>
  );
};