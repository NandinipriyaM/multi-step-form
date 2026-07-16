import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PersonalInfo } from '../components/steps/PersonalInfo';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PersonalInfo Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all form fields', () => {
    render(
      <MemoryRouter>
        <PersonalInfo />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
  });

  it('validates required fields on next click', async () => {
    render(
      <MemoryRouter>
        <PersonalInfo />
      </MemoryRouter>
    );

    const nextButton = screen.getByTestId('personal-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(
      <MemoryRouter>
        <PersonalInfo />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    const nextButton = screen.getByTestId('personal-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('navigates to next step on valid input', async () => {
    render(
      <MemoryRouter>
        <PersonalInfo />
      </MemoryRouter>
    );

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'male' } });

    const nextButton = screen.getByTestId('personal-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/form/address');
    });
  });
});