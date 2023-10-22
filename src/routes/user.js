"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

//routes/user:

const permissions= require('../middlewares/permissions')

const user = require('../controllers/user')

//URL: /users   =>index.js de yazilacak

router.route('/')
    .get(permissions.isAdmin, user.list)  //adminsen kullanicilarin listesine erisebil
    .post(user.create)

router.route('/:id')
    .get(permissions.isAdmin, user.read)    //adminsen kullanici bilgilerini gorebil
    .put(permissions.isAdmin, user.update)
    .patch(permissions.isAdmin, user.update)
    .delete(permissions.isAdmin, user.delete)

/* ------------------------------------------------------- */
module.exports = router