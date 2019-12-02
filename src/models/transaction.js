const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    idStore: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Stores'
    },
    idItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Items'
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        default: Date.now()
    }
});

const Transaction = mongoose.model('Transactions', transactionSchema);

module.exports = Transaction;