import React, { useState, useEffect } from 'react';

const Withdraw = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');

  const apiUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'http://backend:5000';

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

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!selectedAccount || withdrawAmount <= 0) {
      setMessage('Please select a valid account and amount.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/accounts/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: selectedAccount.accountNumber,
          amount: parseFloat(withdrawAmount),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedAccount({ ...selectedAccount, balance: result.newBalance });
        setMessage('Withdrawal successful');
        setWithdrawAmount(''); // Clear the withdrawal amount input
      } else {
        setMessage(result.message || 'Error making withdrawal');
      }
    } catch (error) {
      setMessage('Error making withdrawal');
      console.error('Withdrawal error:', error);
    }
  };

  return (
    <div className="withdraw-container">
      <h2>Withdraw</h2>
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

          <form onSubmit={handleWithdraw}>
            <input
              type="number"
              value={withdrawAmount}
              placeholder="Withdraw Amount"
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button type="submit">Withdraw</button>
          </form>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Withdraw;

