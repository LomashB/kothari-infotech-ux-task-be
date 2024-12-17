const WebSocket = require('ws');
const Order = require('../models/Order');

let wss;

// Initialize WebSocket server
exports.initWebSocketServer = (server) => {
  if (wss) {
    console.warn('WebSocket server is already initialized.');
    return wss;
  }

  wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws) => {
    console.log('A user connected.');

    // Send initial orders to the connected client
    try {
      const orders = await Order.find({});
      if (orders.length > 0) {
        ws.send(JSON.stringify({ event: 'orders:initial', data: orders }));
      } else {
        console.log('No orders found to send to the client.');
      }
    } catch (err) {
      console.error('Error fetching initial orders:', err.message);
      ws.send(JSON.stringify({ event: 'error', message: 'Failed to fetch initial orders.' }));
    }

    // Handle incoming messages
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message);

        switch (parsedMessage.event) {
          case 'orders:update':
            const { orderId, updatedOrder } = parsedMessage.data;
            const order = await Order.findByIdAndUpdate(orderId, updatedOrder, { new: true });
            if (order) {
              // Broadcast the updated order to all connected clients
              broadcast({ event: 'orders:updated', data: order });
              console.log(`Order updated: ${orderId}`);
            } else {
              console.warn(`Order with ID ${orderId} not found.`);
              ws.send(
                JSON.stringify({
                  event: 'error',
                  message: `Order with ID ${orderId} not found.`,
                })
              );
            }
            break;

          default:
            console.warn(`Unhandled event: ${parsedMessage.event}`);
            break;
        }
      } catch (err) {
        console.error('Error handling message:', err);
        ws.send(JSON.stringify({
          event: 'error',
          message: 'Invalid message format or internal server error.',
        }));
      }
    });

    // Handle client disconnection
    ws.on('close', (code, reason) => {
      console.log(`A user disconnected. Code: ${code}, Reason: ${reason}`);
    });
  });

  return wss;
};

// Broadcast a message to all connected clients
const broadcast = (message) => {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Export the broadcast function
exports.broadcast = broadcast;
