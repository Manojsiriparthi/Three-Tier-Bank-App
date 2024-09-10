import React, { useState, useEffect } from 'react';

const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'http://backend:5000';

const Withdraw = () => {
  const [accounts, setAccounts] = useState([]); // State for storing accounts
  const [selectedAccount, setSelectedAccount] = useState(null); // State for the selected account
  const [withdrawAmount, setWithdrawAmount] = useState(0); // State for withdrawal amount
  const [message, setMessage] = useState(''); // State for success/error messages

  // Fetch accounts from the backend when the component loads
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/accounts`);
        const data = await response.json();
        setAccounts(data); // Set the accounts in state
      } catch (error) {
        console.error('Error fetching accounts:', error); // Log errors
      }
    };

    fetchAccounts();
  }, [apiUrl]);

  // Handle the selection of an account from the dropdown
  const handleAccountChange = (e) => {
    const account = accounts.find(acc => acc._id === e.target.value); // Find account by ID
    setSelectedAccount(account); // Set the selected account
  };

  // Handle the withdrawal action
  const handleWithdraw = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!selectedAccount) { // Ensure an account is selected
      setMessage('Please select an account');
      return;
    }

    if (withdrawAmount <= 0) { // Ensure withdrawal amount is valid
      setMessage('Please enter a valid withdrawal amount');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/accounts/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: selectedAccount.accountNumber, // Send selected account number
          amount: parseInt(withdrawAmount, 10), // Ensure withdrawal amount is sent as a number
        }),
      });

      const result = await response.json(); // Get response from backend
      if (response.ok) {
        // Update the selected account's balance and display success message
        setSelectedAccount({ ...selectedAccount, balance: result.newBalance });
        setMessage('Withdrawal successful');
      } else {
        setMessage(result.message || 'Error making withdrawal'); // Handle errors
      }
    } catch (error) {
      console.error('Error making withdrawal:', error); // Log errors
      setMessage('Error making withdrawal');
    }
  };

  return (
    <div className="withdraw-container">
      <h2>Withdraw</h2>

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

          {/* Form for withdrawing money */}
          <form onSubmit={handleWithdraw} className="form-container">
            <input 
              type="number" 
              placeholder="Withdraw Amount" 
              onChange={(e) => setWithdrawAmount(e.target.value)} // Update withdrawal amount
            />
            <button type="submit">Withdraw</button>
          </form>
        </>
      )}

      {/* Display success or error message immediately after withdrawal */}
      <p style={{ marginTop: '10px' }}>{message}</p> {/* Spacing after withdraw button */}
    </div>
  );
};

export default Withdraw;

