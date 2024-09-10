import React, { useState } from 'react';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    annualIncome: '', // This will be a string initially but converted later
    accountType: 'saving',
  });
 // Dynamically set the API URL based on the environment (local or Docker)
  const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : 'http://backend:5000';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/accounts/register`, { // Dynamically use apiUrl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          annualIncome: parseInt(formData.annualIncome, 10), // Ensure annualIncome is sent as a number
        }),  // Ensure this comma is present
      });
      const result = await response.json();
      console.log('Registration successful:', result);
    } catch (error) {
      console.error('Error registering account:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input type="text" name="address" placeholder="Address" onChange={handleChange} />
      <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
      <input
        type="number"
        name="annualIncome"
        placeholder="Annual Income"
        onChange={handleChange}
      />
      <select name="accountType" onChange={handleChange}>
        <option value="saving">Saving</option>
        <option value="personal">Personal</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Registration;

