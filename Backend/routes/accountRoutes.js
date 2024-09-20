const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import MySQL connection

// Register a new account
router.post('/register', (req, res) => {
  const { firstName, lastName, address, contactNumber, annualIncome, accountType } = req.body;

  if (!firstName || !lastName || !address || !contactNumber || !annualIncome || !accountType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const accountNumber = Math.floor(Math.random() * 10000000000).toString();
  const ifscCode = 'BANK0001234';
  const startingBalance = (Math.random() * 500 + 100).toFixed(2);  // Random balance between 100 and 500

  const sql = 'INSERT INTO accounts (firstName, lastName, address, contactNumber, annualIncome, accountType, accountNumber, ifscCode, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [firstName, lastName, address, contactNumber, annualIncome, accountType, accountNumber, ifscCode, startingBalance], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ accountNumber, ifscCode, balance: startingBalance });
  });
});

// Get all accounts
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM accounts';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// Deposit into an account
router.post('/deposit', (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Account number and valid amount are required' });
  }

  const getBalanceSql = 'SELECT balance FROM accounts WHERE accountNumber = ?';
  db.query(getBalanceSql, [accountNumber], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const newBalance = (parseFloat(results[0].balance) + parseFloat(amount)).toFixed(2);
    const updateBalanceSql = 'UPDATE accounts SET balance = ? WHERE accountNumber = ?';

    db.query(updateBalanceSql, [newBalance, accountNumber], (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: 'Deposit successful', newBalance });
    });
  });
});

// Withdraw from an account
router.post('/withdraw', (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Account number and valid amount are required' });
  }

  const getBalanceSql = 'SELECT balance FROM accounts WHERE accountNumber = ?';
  db.query(getBalanceSql, [accountNumber], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (results[0].balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const newBalance = (parseFloat(results[0].balance) - parseFloat(amount)).toFixed(2);
    const updateBalanceSql = 'UPDATE accounts SET balance = ? WHERE accountNumber = ?';

    db.query(updateBalanceSql, [newBalance, accountNumber], (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: 'Withdrawal successful', newBalance });
    });
  });
});

// Transfer between accounts
router.post('/transfer', (req, res) => {
  const { fromAccountNumber, toAccountNumber, amount } = req.body;

  if (!fromAccountNumber || !toAccountNumber || amount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer details' });
  }

  // Start a MySQL transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Transaction failed to start' });
    }

    // Step 1: Deduct from the sender's account
    const deductSql = 'UPDATE accounts SET balance = balance - ? WHERE accountNumber = ? AND balance >= ?';
    db.query(deductSql, [amount, fromAccountNumber, amount], (err, result) => {
      if (err || result.affectedRows === 0) {
        return db.rollback(() => {
          res.status(400).json({ message: 'Insufficient balance or invalid sender account' });
        });
      }

      // Step 2: Add to the recipient's account
      const addSql = 'UPDATE accounts SET balance = balance + ? WHERE accountNumber = ?';
      db.query(addSql, [amount, toAccountNumber], (err, result) => {
        if (err || result.affectedRows === 0) {
          return db.rollback(() => {
            res.status(400).json({ message: 'Invalid recipient account' });
          });
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Transfer failed' });
            });
          }
          res.status(200).json({ message: 'Transfer successful' });
        });
      });
    });
  });
});

module.exports = router;

