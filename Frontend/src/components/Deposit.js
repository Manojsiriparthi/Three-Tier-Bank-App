import React, { useState, useEffect } from 'react';

const Deposit = () => {
  const [accounts, setAccounts] = useState([]); // State for storing accounts
  const [selectedAccount, setSelectedAccount] = useState(null); // State for the selected account
  const [depositAmount, setDepositAmount] = useState(0); // State for deposit amount
  const [message, setMessage] = useState(''); // State for success/error messages

  // API URL depending on whether the environment is development or production (Docker)
  const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000' 
    : 'http://backend:5000';

  // Fetch accounts from the backend when the component loads
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/accounts`); // Fetch accounts from backend
        const data = await response.json(); // Parse the JSON data

        console.log('Fetched accounts:', data); // Log fetched data for debugging
        setAccounts(data); // Set the accounts in state
      } catch (error) {
        console.error('Error fetching accounts:', error); // Log any errors
      }
    };

    fetchAccounts();
  }, [apiUrl]); // Dependency array includes apiUrl to ensure it runs on load

  // Handle the selection of an account from the dropdown
  const handleAccountChange = (e) => {
    const account = accounts.find(acc => acc._id === e.target.value); // Find account by ID
    setSelectedAccount(account); // Set the selected account
  };

  // Handle the deposit action
  const handleDeposit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!selectedAccount) { // Ensure an account is selected
      setMessage('Please select an account');
      return;
    }

    if (depositAmount <= 0) { // Ensure deposit amount is valid
      setMessage('Please enter a valid deposit amount');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/accounts/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: selectedAccount.accountNumber, // Send selected account number
          amount: parseInt(depositAmount, 10), // Ensure deposit amount is sent as a number
        }),
      });

      const result = await response.json(); // Get response from backend
      if (response.ok) {
        // Update the selected account's balance and display success message
        setSelectedAccount({ ...selectedAccount, balance: result.newBalance });
        setMessage('Deposit successful'); 
      } else {
        setMessage(result.message || 'Error making deposit'); // Handle errors
      }
    } catch (error) {
      console.error('Error making deposit:', error); // Log errors
      setMessage('Error making deposit');
    }
  };

  return (
    <div className="deposit-container">
      <h2>Deposit</h2>

      {/* Dropdown to select an account */}
      <label>Select Account</label>
      <select onChange={handleAccountChange}>
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.firstName} {account.lastName}
          </option>
        ))}
      </select>

      {/* Display selected account details if an account is selected */}
      {selectedAccount && (
        <>
          <p>Account Name: {selectedAccount.firstName} {selectedAccount.lastName}</p>
          <p>Account Number: {selectedAccount.accountNumber}</p>
          <p>IFSC Code: {selectedAccount.ifscCode}</p>
          
          {/* Only 2 lines of space after balance */}
          <p>Available Balance: £{selectedAccount.balance}</p>

          {/* Form for depositing money */}
          <form onSubmit={handleDeposit} className="form-container">
            <input 
              type="number" 
              placeholder="Deposit Amount" 
              onChange={(e) => setDepositAmount(e.target.value)} // Update deposit amount
            />
            <button type="submit">Deposit</button>
          </form>
        </>
      )}

      {/* Display success or error message immediately after deposit */}
      <p style={{ marginTop: '10px' }}>{message}</p> {/* Spacing after deposit button */}
    </div>
  );
};

export default Deposit;

