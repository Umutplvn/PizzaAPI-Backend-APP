"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Order Controller:

const Order = require('../models/order')
const Pizza = require('../models/pizza')

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Orders"]
            #swagger.summary = "List Orders"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        // const data = await res.getModelList(Order, {}, ['pizzaId', 'userId'])    //pizzaId ve userId detaylarini gostermek icin

        const data = await res.getModelList(Order, {}, [ 'userId', {'path':'pizzaId', populate:'toppings'}]) // userId, pizzaId ve pizza icindeki toppings detaylarini gormek icin.  PizzaId yi ac ve toppings detaylarini populate yaparak bana goster. Nested bir sekilde pizza icerisindeki toppings detaylarini cagirmis olduk

        //* const data = await res.getModelList(Order, {}, [ 'userId', {'path':'pizzaId', populate:{'path':'toppings', populate:'...'}}])  ustteki nested yapiyi bir adim daha iler tasiyabilmek icin


        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Order),
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Orders"]
            #swagger.summary = "Create Order"
        */

          // Calculations:
        req.body.quantity = req.body?.quantity || 1 // default: 1
        if (!req.body?.price) {
            const dataPizza = await Pizza.findOne({ _id: req.body.pizzaId }, { _id: 0, price: 1 })// findOne({filtreleme parametresi}, {gormek istedigim sutun yani burada price:1 ya da price:true diyereke bana pricei goster dedik. id defaultu true'dur})
            req.body.price = dataPizza.price
        }

        req.body.totalPrice=(req.body.price * req.body.quantity).toFixed(2)
        const data = await Order.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Orders"]
            #swagger.summary = "Get Single Order"
        */

        const data = await Order.findOne({ _id: req.params.id }).populate([ 'userId', {'path':'pizzaId', populate:'toppings'}])

        res.status(200).send({
            error: false,
            data
        })

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Orders"]
            #swagger.summary = "Update Order"
        */

            // Calculations:
            req.body.quantity = req.body?.quantity || 1 // default: 1
            if (!req.body?.price) {
              const dataOrder = await Order.findOne({ _id: req.params.id }, { _id: 0, price: 1 })  // findOne({filtreleme parametresi}, {gormek istedigim sutun yani burada price:1 ya da price:true diyereke bana pricei goster dedik. id defaultu true'dur})
              req.body.price = dataOrder.price
            }
        
        req.body.totalPrice=(req.body.price * req.body.quantity).toFixed(2)

        const data = await Order.updateOne({ _id: req.params.id }, req.body)

        res.status(202).send({
            error: false,
            data,
            new: await Order.findOne({ _id: req.params.id })
        })

    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Orders"]
            #swagger.summary = "Delete Order"
        */

        const data = await Order.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })

    },
}