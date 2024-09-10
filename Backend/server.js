require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

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

// Import and use the routes
const accountRoutes = require('./routes/accountRoutes');
app.use('/api/accounts', accountRoutes); // This mounts the account routes

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

