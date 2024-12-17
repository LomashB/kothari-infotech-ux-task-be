const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      bread: { type: Object, required: true },
      patty: { type: Object, required: true },
      sauces: [{ type: Object, required: true }],
      vegetables: [{ type: Object, required: true }],
      quantity: { type: Number, required: true },
    },
  ],
  status: { type: String, required: true, default: 'pending' },
  timeRemaining: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);