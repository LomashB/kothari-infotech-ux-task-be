const express = require('express');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const { initWebSocketServer } = require('./websocket/socketServer');

const app = express();
const cors = require('cors');
const http = require('http'); // Ensure this line is correct

// Connect to MongoDB
connectDB();
app.use(cors()); // Enable CORS for all routes

// Middleware
app.use(express.json());

// Routes
app.use('/api', orderRoutes);

const server = http.createServer(app); // This should work now

initWebSocketServer(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { // Use server instead of http
  console.log(`Server is running on port ${PORT}`);
});