"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */
// Pizza Model:

const PizzaSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },

    image: {
        type: String,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
    },

    toppings: [ // push, pull   // birden fazla topping veri girisi olabilecegi icin array icine koyuyoruz ve bunlari push pull komutlari ile yonetebiliyoruz
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topping'  // iliski kurulacak olan model
        }
    ]

}, {
    collection: 'pizzas',
    timestamps: true
})

/* ------------------------------------------------------- */
module.exports = mongoose.model('Pizza', PizzaSchema)