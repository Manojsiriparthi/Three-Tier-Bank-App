require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import CORS middleware
const connection = require('./config/db'); // MySQL connection
const accountRoutes = require('./routes/accountRoutes'); // Account routes
const app = express();

// Use PORT from environment variables or fallback to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse incoming JSON requests

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Use account routes
app.use('/api/accounts', accountRoutes); // This mounts the account routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

