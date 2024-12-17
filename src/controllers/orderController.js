const Order = require('../models/Order');
const { broadcast } = require('../websocket/socketServer');

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    broadcast({ event: 'orders:new', data: order });
    
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
    console.log('first')
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};