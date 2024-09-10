// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  annualIncome: { type: Number, required: true },
  accountType: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  ifscCode: { type: String, required: true },
  balance: { type: Number, default: 0 },  // Default balance to 0
});

// The third argument 'backend' forces Mongoose to use the 'backend' collection
const Account = mongoose.model('Account', accountSchema, 'backend');

module.exports = Account;

