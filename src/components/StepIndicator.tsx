import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Step {
  key: string;
  label: string;
  path: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const navigate = useNavigate();

  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.key === currentStep;
          const isClickable = isCompleted || isCurrent;

          return (
            <li
              key={step.key}
              className={`relative flex-1 ${
                index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
              }`}
            >
              <div className="flex items-center">
                <button
                  onClick={() => isClickable && navigate(step.path)}
                  disabled={!isClickable}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-gray-200 text-gray-600'
                  } ${isClickable ? 'cursor-pointer hover:bg-primary-700' : 'cursor-not-allowed'}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.label} - ${
                    isCompleted
                      ? 'completed'
                      : isCurrent
                      ? 'current step'
                      : 'upcoming'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </button>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                  {step.label}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div className="absolute top-4 left-8 w-full h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};