const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    annualIncome: { type: Number, required: true },  // Store as a number
    accountType: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    ifscCode: { type: String, required: true },
    balance: { type: Number, default: 0 },  // Default balance is 0
});

const Account = mongoose.model('Account', accountSchema, 'backend');  // Use the 'backend' collection

module.exports = Account;

