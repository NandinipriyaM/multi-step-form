import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PersonalInfo } from './components/steps/PersonalInfo';
import { AddressInfo } from './components/steps/AddressInfo';
import { AccountInfo } from './components/steps/AccountInfo';
import { Review } from './components/steps/Review';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to Registration
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Complete our multi-step registration form to create your account.
            The process takes just a few minutes.
          </p>
          <div className="mt-10">
            <a
              href="/form/personal"
              className="btn-primary inline-flex items-center px-8 py-3 text-lg"
            >
              Get Started
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form/personal" element={<PersonalInfo />} />
          <Route path="/form/address" element={<AddressInfo />} />
          <Route path="/form/account" element={<AccountInfo />} />
          <Route path="/form/review" element={<Review />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;