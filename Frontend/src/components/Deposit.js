import React, { useState, useEffect } from 'react';

const Deposit = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [message, setMessage] = useState('');

  const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'http://backend:5000';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/accounts`); // Fetch accounts
        const data = await response.json();
        setAccounts(data); // Set the fetched accounts in state
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountChange = (e) => {
    const account = accounts.find(acc => acc._id === e.target.value);
    setSelectedAccount(account);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) {
      setMessage('Please select an account');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/accounts/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: selectedAccount.accountNumber,
          amount: parseInt(depositAmount),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedAccount({ ...selectedAccount, balance: result.newBalance });
        setMessage('Deposit successful');
      } else {
        setMessage(result.message || 'Error making deposit');
      }
    } catch (error) {
      console.error('Error making deposit:', error);
      setMessage('Error making deposit');
    }
  };

  return (
    <div className="deposit-container">
      <h2>Deposit</h2>

      <label>Select Account</label>
      <select onChange={handleAccountChange}>
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.firstName} {account.lastName}
          </option>
        ))}
      </select>

      {selectedAccount && (
        <>
          <p>Account Name: {selectedAccount.firstName} {selectedAccount.lastName}</p>
          <p>Account Number: {selectedAccount.accountNumber}</p>
          <p>IFSC Code: {selectedAccount.ifscCode}</p>
          <p>Available Balance: £{selectedAccount.balance}</p>

          <form onSubmit={handleDeposit} className="form-container">
            <input 
              type="number" 
              placeholder="Deposit Amount" 
              onChange={(e) => setDepositAmount(e.target.value)} 
            />
            <button type="submit">Deposit</button>
          </form>
        </>
      )}
      <p>{message}</p>
    </div>
  );
};

export default Deposit;

