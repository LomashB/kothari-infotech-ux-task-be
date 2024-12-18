const express = require('express');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const { initWebSocketServer } = require('./websocket/socketServer');

const app = express();
const cors = require('cors');
const http = require('http');

// Connect to MongoDB
connectDB();
app.use(cors()); // Enable CORS 

// Middleware 
app.use(express.json());

// routes
app.use('/api', orderRoutes);

const server = http.createServer(app); 

initWebSocketServer(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});