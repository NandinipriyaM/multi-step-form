import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/formStore';
import { StepIndicator } from './StepIndicator';
import { Button } from './common/Button';

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  currentStep: string;
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  description,
  currentStep,
}) => {
  const navigate = useNavigate();
  const { resetForm } = useFormStore();

  const steps = [
    { key: 'personal', label: 'Personal', path: '/form/personal' },
    { key: 'address', label: 'Address', path: '/form/address' },
    { key: 'account', label: 'Account', path: '/form/account' },
    { key: 'review', label: 'Review', path: '/form/review' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Registration Form
            </h1>
            <Button
              variant="secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
                  resetForm();
                  navigate('/');
                }
              }}
              ariaLabel="Reset form"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
          
          <div className="form-step">
            {children}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 Multi-Step Form. All fields marked with * are required.
          </p>
        </div>
      </footer>
    </div>
  );
};