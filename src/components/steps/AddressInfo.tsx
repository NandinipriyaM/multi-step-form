import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { FormLayout } from '../FormLayout';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateAddressInfo } from '../../utils/validation';
import { getCities } from '../../utils/api';

export const AddressInfo: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    updateAddressInfo,
    setErrors,
    touchField,
    touchedFields,
  } = useFormStore();

  const [cities, setCities] = useState<Array<{ id: number; name: string; state: string }>>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = await getCities();
      setCities(citiesData);
    };
    fetchCities();
  }, []);

  const handleChange = useCallback(
    (field: keyof typeof formData.addressInfo) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        updateAddressInfo({ [field]: value });
        touchField(field);

        const currentErrors = useFormStore.getState().errors;
        if (currentErrors[field]) {
          const newErrors = { ...currentErrors };
          delete newErrors[field];
          setErrors(newErrors);
        }
      },
    [updateAddressInfo, touchField, setErrors]
  );

  const handleBack = useCallback(() => {
    navigate('/form/personal');
  }, [navigate]);

  const handleNext = useCallback(() => {
    const currentFormData = useFormStore.getState().formData;
    const stepErrors = validateAddressInfo(currentFormData.addressInfo);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      navigate('/form/account');
    }
  }, [setErrors, navigate]);

  const stateOptions = [
    { value: '', label: 'Select state' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
  ];

  const addressTypeOptions = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' },
  ];

  const cityOptions = cities.map((city) => ({
    value: city.name,
    label: city.name,
  }));

  return (
    <FormLayout
      title="Address Information"
      description="Please provide your current address."
      currentStep="address"
    >
      <div className="space-y-4">
        <Input
          label="Street Address"
          required
          value={formData.addressInfo.street}
          onChange={handleChange('street')}
          error={touchedFields.has('street') ? errors.street : undefined}
          showError={touchedFields.has('street')}
          placeholder="123 Main St"
          autoComplete="street-address"
        />

        <Select
          label="City"
          required
          value={formData.addressInfo.city}
          onChange={handleChange('city')}
          options={cityOptions}
          error={touchedFields.has('city') ? errors.city : undefined}
          showError={touchedFields.has('city')}
          placeholder="Select a city"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="State"
            required
            value={formData.addressInfo.state}
            onChange={handleChange('state')}
            options={stateOptions}
            error={touchedFields.has('state') ? errors.state : undefined}
            showError={touchedFields.has('state')}
            placeholder="Select state"
          />

          <Input
            label="ZIP Code"
            required
            value={formData.addressInfo.zipCode}
            onChange={handleChange('zipCode')}
            error={touchedFields.has('zipCode') ? errors.zipCode : undefined}
            showError={touchedFields.has('zipCode')}
            placeholder="12345"
            autoComplete="postal-code"
          />
        </div>

        <Input
          label="Country"
          required
          value={formData.addressInfo.country}
          onChange={handleChange('country')}
          error={touchedFields.has('country') ? errors.country : undefined}
          showError={touchedFields.has('country')}
          placeholder="United States"
          autoComplete="country-name"
        />

        <Select
          label="Address Type"
          required
          value={formData.addressInfo.addressType}
          onChange={handleChange('addressType')}
          options={addressTypeOptions}
          error={touchedFields.has('addressType') ? errors.addressType : undefined}
          showError={touchedFields.has('addressType')}
        />

        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={handleBack}>
            Previous
          </Button>
          <Button onClick={handleNext} dataTestId="address-next-btn">
            Next Step
          </Button>
        </div>
      </div>
    </FormLayout>
  );
};