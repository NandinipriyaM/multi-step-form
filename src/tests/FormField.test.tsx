import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

describe('FormField Components', () => {
  describe('Input Component', () => {
    it('renders with label', () => {
      render(<Input label="Test Input" />);
      expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    });

    it('shows error message when provided', () => {
      render(<Input label="Test Input" error="This field is required" showError={true} />);
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('shows required indicator', () => {
      render(<Input label="Test Input" required />);
      const label = screen.getByText('Test Input');
      expect(label.querySelector('.text-error-500')).toBeInTheDocument();
    });

    it('handles user input correctly', () => {
      const handleChange = jest.fn();
      render(<Input label="Test Input" onChange={handleChange} />);
      
      const input = screen.getByLabelText('Test Input');
      fireEvent.change(input, { target: { value: 'test value' } });
      
      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('test value');
    });

    it('shows loading spinner when isLoading is true', () => {
      const { container } = render(<Input label="Test Input" isLoading={true} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('sets aria-invalid when error exists', () => {
      render(<Input label="Test Input" error="Error" showError={true} />);
      const input = screen.getByLabelText('Test Input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Select Component', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];

    it('renders with label and options', () => {
      render(<Select label="Test Select" options={options} />);
      expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('shows error message when provided', () => {
      render(
        <Select 
          label="Test Select" 
          options={options} 
          error="Please select an option" 
          showError={true} 
        />
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Please select an option');
    });

    it('handles selection correctly', () => {
      const handleChange = jest.fn();
      render(<Select label="Test Select" options={options} onChange={handleChange} />);
      
      const select = screen.getByLabelText('Test Select');
      fireEvent.change(select, { target: { value: '2' } });
      
      expect(handleChange).toHaveBeenCalled();
      expect(select).toHaveValue('2');
    });
  });
});