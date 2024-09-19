const db = require('../config/db'); // MySQL connection

const Account = {
  create: (data, callback) => {
    const { firstName, lastName, address, contactNumber, annualIncome, accountType, accountNumber, ifscCode, balance } = data;
    const sql = `INSERT INTO accounts (firstName, lastName, address, contactNumber, annualIncome, accountType, accountNumber, ifscCode, balance) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [firstName, lastName, address, contactNumber, annualIncome, accountType, accountNumber, ifscCode, balance], callback);
  },

  findByAccountNumber: (accountNumber, callback) => {
    const sql = 'SELECT * FROM accounts WHERE accountNumber = ?';
    db.query(sql, [accountNumber], callback);
  },

  updateBalance: (accountNumber, balance, callback) => {
    const sql = 'UPDATE accounts SET balance = ? WHERE accountNumber = ?';
    db.query(sql, [balance, accountNumber], callback);
  },

  findAll: (callback) => {
    const sql = 'SELECT * FROM accounts';
    db.query(sql, callback);
  }
};

module.exports = Account;

