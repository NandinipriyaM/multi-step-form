import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Review } from '../components/steps/Review';
import { useFormStore } from '../store/formStore';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../utils/api', () => ({
  submitForm: jest.fn().mockResolvedValue({ status: 201, data: {} }),
}));

describe('Review Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useFormStore.setState({
      formData: {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          dateOfBirth: '1990-01-01',
          gender: 'male',
        },
        addressInfo: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          addressType: 'home',
        },
        accountInfo: {
          username: 'johndoe',
          password: 'StrongP@ss1',
          confirmPassword: 'StrongP@ss1',
          securityQuestion: 'pet-name',
          securityAnswer: 'Buddy',
          acceptTerms: true,
          newsletter: false,
        },
      },
    });
  });

  it('renders form data summary', () => {
    render(
      <MemoryRouter>
        <Review />
      </MemoryRouter>
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <MemoryRouter>
        <Review />
      </MemoryRouter>
    );

    const submitButton = screen.getByTestId('submit-form-btn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/registration complete/i)).toBeInTheDocument();
    });
  });

  it('navigates back to account info', () => {
    render(
      <MemoryRouter>
        <Review />
      </MemoryRouter>
    );

    const backButton = screen.getByText(/previous/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/form/account');
  });
});