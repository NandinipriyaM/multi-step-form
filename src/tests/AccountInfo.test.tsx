import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AccountInfo } from '../components/steps/AccountInfo';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../utils/api', () => ({
  checkUsernameAvailability: jest.fn().mockResolvedValue(true),
}));

describe('AccountInfo Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all form fields', () => {
    render(
      <MemoryRouter>
        <AccountInfo />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/security question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/security answer/i)).toBeInTheDocument();
  });

  it('validates password strength', async () => {
    render(
      <MemoryRouter>
        <AccountInfo />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/^password/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);

    const nextButton = screen.getByTestId('account-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    render(
      <MemoryRouter>
        <AccountInfo />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'StrongP@ss1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentP@ss1' } });

    const nextButton = screen.getByTestId('account-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('requires terms acceptance', async () => {
    render(
      <MemoryRouter>
        <AccountInfo />
      </MemoryRouter>
    );

    const nextButton = screen.getByTestId('account-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/you must accept the terms/i)).toBeInTheDocument();
    });
  });
});