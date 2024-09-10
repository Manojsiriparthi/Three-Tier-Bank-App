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

  // Use correct API URL based on environment
  const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000' 
    : 'http://backend:5000'; // If running in Docker

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
        <input type="number" name="annualIncome" placeholder="Annual Income" onChange={handleChange} />
        <select name="accountType" onChange={handleChange}>
          <option value="saving">Saving</option>
          <option value="personal">Personal</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {/* Display success or failure message below the form */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Registration;

