const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    idStore: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [{
        quantity: {
            type: Number,
            required: true
        },
        metric: {
            type: String,
            required: true
        }
    }],
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;