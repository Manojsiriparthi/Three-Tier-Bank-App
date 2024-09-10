const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Register a new account
router.post('/register', async (req, res) => {
  const { firstName, lastName, address, contactNumber, annualIncome, accountType } = req.body;

  if (!firstName || !lastName || !address || !contactNumber || !annualIncome || !accountType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const accountNumber = Math.floor(Math.random() * 10000000000).toString();
  const ifscCode = 'BANK0001234';
  const startingBalance = Math.floor(Math.random() * 500) + 100;  // Random balance between £100 and £500

  const newAccount = new Account({
    firstName,
    lastName,
    address,
    contactNumber,
    annualIncome,
    accountType,
    accountNumber,
    ifscCode,
    balance: startingBalance,  // Assign random starting balance
  });

  try {
    await newAccount.save();
    res.json(newAccount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch all registered accounts for dropdown selection
router.get('/', async (req, res) => { // Ensure this is a GET route
  try {
    const accounts = await Account.find({});
    res.json(accounts); // Return the account data
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deposit route
router.post('/deposit', async (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount) {
    return res.status(400).json({ message: 'Account number and amount are required' });
  }

  try {
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.balance += amount;
    await account.save();

    res.json({
      message: 'Deposit successful',
      accountNumber: account.accountNumber,
      newBalance: account.balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Withdraw route
router.post('/withdraw', async (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount) {
    return res.status(400).json({ message: 'Account number and amount are required' });
  }

  try {
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    account.balance -= amount;
    await account.save();

    res.json({
      message: 'Withdrawal successful',
      accountNumber: account.accountNumber,
      newBalance: account.balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Transfer route (optional if you need it)
router.post('/transfer', async (req, res) => {
  const { fromAccountNumber, toAccountNumber, amount } = req.body;

  if (!fromAccountNumber || !toAccountNumber || !amount) {
    return res.status(400).json({ message: 'From account, to account, and amount are required' });
  }

  try {
    const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ message: 'One or both accounts not found' });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance in source account' });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    res.json({
      message: 'Transfer successful',
      fromAccountNumber: fromAccount.accountNumber,
      toAccountNumber: toAccount.accountNumber,
      fromAccountBalance: fromAccount.balance,
      toAccountBalance: toAccount.balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

