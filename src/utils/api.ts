const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/username-check`);
    if (!response.ok) {
      throw new Error('Failed to check username availability');
    }
    const data = await response.json();
    return !data.taken.includes(username.toLowerCase());
  } catch (error) {
    console.error('Error checking username:', error);
    // In case of API error, assume username is available
    return true;
  }
};

export const getCities = async (): Promise<Array<{ id: number; name: string; state: string }>> => {
  try {
    const response = await fetch(`${API_URL}/cities`);
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const submitForm = async (formData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    return {
      data,
      status: response.status,
      message: 'Form submitted successfully',
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('Failed to submit form');
  }
};