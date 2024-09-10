import React, { useState, useEffect } from 'react';

const apiUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : 'http://backend:5000';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]); // State for storing accounts
  const [fromAccount, setFromAccount] = useState(null); // State for the from account
  const [toAccount, setToAccount] = useState(null); // State for the to account
  const [transferAmount, setTransferAmount] = useState(0); // State for transfer amount
  const [message, setMessage] = useState(''); // State for success/error messages

  // Fetch accounts from the backend when the component loads
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/accounts`);
        const data = await response.json();
        setAccounts(data); // Set accounts in state
      } catch (error) {
        console.error('Error fetching accounts:', error); // Log any errors
      }
    };

    fetchAccounts();
  }, [apiUrl]);

  // Handle the transfer action
  const handleTransfer = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!fromAccount || !toAccount || fromAccount._id === toAccount._id) {
      setMessage('Please select valid accounts');
      return;
    }

    if (transferAmount <= 0) {
      setMessage('Please enter a valid transfer amount');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/accounts/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccountNumber: fromAccount.accountNumber, // Send from account number
          toAccountNumber: toAccount.accountNumber, // Send to account number
          amount: parseInt(transferAmount, 10), // Ensure transfer amount is sent as a number
        }),
      });

      const result = await response.json(); // Get response from backend
      if (response.ok) {
        setMessage('Transfer successful');
      } else {
        setMessage(result.message || 'Error making transfer');
      }
    } catch (error) {
      console.error('Error making transfer:', error); // Log errors
      setMessage('Error making transfer');
    }
  };

  return (
    <div className="transfer-container">
      <h2>Transfer</h2>

      {/* Dropdown to select the from account */}
      <label>From Account</label>
      <select onChange={(e) => setFromAccount(accounts.find(acc => acc._id === e.target.value))}>
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.firstName} {account.lastName}
          </option>
        ))}
      </select>

      {/* Dropdown to select the to account */}
      <label style={{ marginTop: '10px' }}>To Account</label>
      <select onChange={(e) => setToAccount(accounts.find(acc => acc._id === e.target.value))}>
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.firstName} {account.lastName}
          </option>
        ))}
      </select>

      {/* Form for transferring money */}
      <form onSubmit={handleTransfer} className="form-container" style={{ marginTop: '10px' }}>
        <input 
          type="number" 
          placeholder="Transfer Amount" 
          onChange={(e) => setTransferAmount(e.target.value)} // Update transfer amount
        />
        <button type="submit">Transfer</button>
      </form>

      {/* Display success or error message with margin */}
      <p style={{ marginTop: '10px' }}>{message}</p>
    </div>
  );
};

export default Transfer;

