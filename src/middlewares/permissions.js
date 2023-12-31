"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Middleware: permissions

module.exports = {

    isLogin: (req, res, next) => {


        if (req.isLogin) {
            next()
        } else {
            res.errorStatusCode = 403
            throw new Error('No Permission: You must login first.')
        }
    },

    isAdmin: (req, res, next) => {

        if (req.isLogin && req.user.isAdmin) {
            next()
        } else {
            res.errorStatusCode = 403
            throw new Error('No Permission: You must login and be Admin.')
        }
    },
}