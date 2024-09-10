require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const app = express();

// Use PORT from environment variables or fallback to 5000
const PORT = process.env.PORT || 5000;

// Use MONGO_URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connection successful');
    startServer();  // Start the server after the database connection is successful
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);  // Exit the process if the connection fails
  });

// Import and use the account routes
const accountRoutes = require('./routes/accountRoutes');
app.use('/api/accounts', accountRoutes); // This mounts the account routes

// Function to start the server
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

