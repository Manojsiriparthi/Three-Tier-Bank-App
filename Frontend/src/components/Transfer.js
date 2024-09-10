import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [transferAmount, setTransferAmount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/accounts`);
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || fromAccount._id === toAccount._id) {
      setMessage('Please select valid accounts');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccountNumber: fromAccount.accountNumber,
          toAccountNumber: toAccount.accountNumber,
          amount: parseInt(transferAmount),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Transfer successful');
      } else {
        setMessage(result.message || 'Error making transfer');
      }
    } catch (error) {
      console.error('Error making transfer:', error);
      setMessage('Error making transfer');
    }
  };

  return (
    <div className="transfer-container">
      <h2>Transfer</h2>

      <label>From Account</label>
      <select onChange={(e) => setFromAccount(accounts.find(acc => acc._id === e.target.value))}>
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.firstName} {account.lastName}
          </option>
        ))}
      </select>

      <label>To Account</label>
      <select onChange={(e) => setToAccount(accounts.find(acc => acc._id === e.target.value))}>
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.firstName} {account.lastName}
          </option>
        ))}
      </select>

      <form onSubmit={handleTransfer} className="form-container">
        <input 
          type="number" 
          placeholder="Transfer Amount" 
          onChange={(e) => setTransferAmount(e.target.value)} 
        />
        <button type="submit">Transfer</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Transfer;

