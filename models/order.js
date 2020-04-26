const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  amount: {
    type: Number
  },
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

orderSchema.methods.removeInvoice = async (id) => {
    fs.unlink(`data/invoices/invoice-${id}.pdf`, (err) => {
      return err && console.log('Error: while trying to unlink pdf attachment', err);
    });
}

module.exports = mongoose.model('Order', orderSchema);
