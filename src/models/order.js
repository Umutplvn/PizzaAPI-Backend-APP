"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */
// Order Model:

const OrderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    pizzaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizza',
        required: true,
    },

    size: {
        type: String,
        required: true,
        enum: ['Small', 'Medium', 'Large', 'XLarge']    //enum: size kismina sadece tanimladigim verilerden birisi gelebilir baska veri kabul etme
    },

    quantity: {
        type: Number,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    totalPrice: {
        type: Number,
    },

}, {
    collection: 'orders',
    timestamps: true
})

/* ------------------------------------------------------- */
module.exports = mongoose.model('Order', OrderSchema)