import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AddressInfo } from '../components/steps/AddressInfo';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the API call
jest.mock('../utils/api', () => ({
  getCities: jest.fn().mockResolvedValue([
    { id: 1, name: 'New York', state: 'NY' },
    { id: 2, name: 'Los Angeles', state: 'CA' },
  ]),
}));

describe('AddressInfo Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all form fields', async () => {
    render(
      <MemoryRouter>
        <AddressInfo />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address type/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <MemoryRouter>
        <AddressInfo />
      </MemoryRouter>
    );

    const nextButton = screen.getByTestId('address-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/street address is required/i)).toBeInTheDocument();
    });
  });

  it('validates ZIP code format', async () => {
    render(
      <MemoryRouter>
        <AddressInfo />
      </MemoryRouter>
    );

    const zipInput = screen.getByLabelText(/zip code/i);
    fireEvent.change(zipInput, { target: { value: 'invalid' } });
    fireEvent.blur(zipInput);

    const nextButton = screen.getByTestId('address-next-btn');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/valid zip code/i)).toBeInTheDocument();
    });
  });

  it('navigates back to personal info', () => {
    render(
      <MemoryRouter>
        <AddressInfo />
      </MemoryRouter>
    );

    const backButton = screen.getByText(/previous/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/form/personal');
  });
});