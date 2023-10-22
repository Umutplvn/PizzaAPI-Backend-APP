"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// $ npm i jsonwebtoken
// app.use(authentication):

const jwt = require('jsonwebtoken')
module.exports = (req, res, next)=>{
const auth = req.headers?.authorization // Bearer 12423we2344234...
const accessToken = auth ? auth.split(' ')[1] : null// ['Bearer','token...' ]

req.isLogin =false, //bu bir middleware oldugu icin isLogin ve user verileriminde sonraki adima aktarilmasi icin burada degisken olusturdum ve cagirdim
req.user=null

jwt.verify(accessToken, process.env.ACCESS_KEY, function(err, userData){   //sifrelenmis veriyi yani tokeni decode yapiyoruz. accessTokeni al bunu access_key ile cozumle, cozme basariliysa err ver yoksa userData don

if(userData && userData.isActive){
    req.isLogin=true
    req.user=userData
}
})
next()
}