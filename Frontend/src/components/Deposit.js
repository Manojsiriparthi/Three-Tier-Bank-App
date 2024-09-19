import React, { useState, useEffect } from 'react';

const Deposit = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [message, setMessage] = useState('');

  const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'http://backend:5000';

  // Fetch accounts when component loads
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/accounts`);
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [apiUrl]);

  const handleAccountChange = (e) => {
    const account = accounts.find(acc => acc.id === parseInt(e.target.value));
    setSelectedAccount(account);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!selectedAccount || depositAmount <= 0) {
      setMessage('Please select a valid account and amount.');
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
          amount: parseFloat(depositAmount),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedAccount({ ...selectedAccount, balance: result.newBalance });
        setMessage('Deposit successful');
        setDepositAmount(''); // Clear the deposit amount input
      } else {
        setMessage(result.message || 'Error making deposit');
      }
    } catch (error) {
      setMessage('Error making deposit');
      console.error('Deposit error:', error);
    }
  };

  return (
    <div className="deposit-container">
      <h2>Deposit</h2>
      <label>Select Account</label>
      <select onChange={handleAccountChange}>
        <option value="">Select an account</option>
        {accounts.map(account => (
          <option key={account.id} value={account.id}>
            {account.firstName} {account.lastName}
          </option>
        ))}
      </select>

      {selectedAccount && (
        <>
          <p>Account Name: {selectedAccount.firstName} {selectedAccount.lastName}</p>
          <p>Account Number: {selectedAccount.accountNumber}</p>
          <p>IFSC Code: {selectedAccount.ifscCode}</p>
          <p>Available Balance: ₹{selectedAccount.balance}</p>

          <form onSubmit={handleDeposit}>
            <input
              type="number"
              value={depositAmount}
              placeholder="Deposit Amount"
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button type="submit">Deposit</button>
          </form>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Deposit;

