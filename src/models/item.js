const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    idStore: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Stores'
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [{
        ingredientName: {
            type: String,
            required: true
        },
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

const Item = mongoose.model('Items', itemSchema);

module.exports = Item;