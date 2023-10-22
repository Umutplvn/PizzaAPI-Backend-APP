"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
const permissions= require('../middlewares/permissions')

/* ------------------------------------------------------- */
// routes/topping:

const topping = require('../controllers/topping')

// URL: /toppings

router.use(permissions.isAdmin) //asagidakilerin hepsinin basina permission.isAdmin gelmis gibi oldu

router.route('/')
    .get(topping.list)
    .post(topping.create)

router.route('/:id')
    .get(topping.read)
    .put(topping.update)
    .patch(topping.update)
    .delete(topping.delete)

/* ------------------------------------------------------- */
module.exports = router