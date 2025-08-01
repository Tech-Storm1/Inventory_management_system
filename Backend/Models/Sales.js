const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const Sales = mongoose.model('Sales', SalesSchema);
module.exports = Sales;
