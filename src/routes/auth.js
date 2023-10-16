"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/auth:

const auth = require('../controllers/auth')

// URL: /auth

router.post('/login', auth.login)
router.post('/refresh', auth.refresh)
router.get('/logout', auth.logout)  //swagger yakalasin diye ".all" yerine "get" yazdik

/* ------------------------------------------------------- */
module.exports = router