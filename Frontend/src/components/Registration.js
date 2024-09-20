import React, { useState } from 'react';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    annualIncome: '',
    accountType: 'saving',
  });
  const [message, setMessage] = useState(''); // State for success/failure message
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  // Set correct API URL based on environment (local or production)
  const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000' 
    : 'http://localhost:5000';

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.contactNumber ||
      !formData.annualIncome
    ) {
      setMessage('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Check if form is valid

    setIsLoading(true); // Start loading indicator

    try {
      const response = await fetch(`${apiUrl}/api/accounts/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          annualIncome: parseInt(formData.annualIncome, 10), // Ensure annualIncome is sent as a number
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Registration successful!');
      } else {
        setMessage(`Error: ${result.message || 'Failed to register account'}`);
      }
    } catch (error) {
      setMessage('Error registering account. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="registration-container">
      <h2>Register a New Account</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
        <input type="number" name="annualIncome" placeholder="Annual Income" onChange={handleChange} required />
        <select name="accountType" onChange={handleChange}>
          <option value="saving">Saving</option>
          <option value="personal">Personal</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Submit'}
        </button>
      </form>

      {/* Display success or failure message below the form */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Registration;

