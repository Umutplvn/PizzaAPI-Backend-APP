"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Auth Controller:

const jwt = require('jsonwebtoken')
const setToken = require('../helpers/setToken')

const User = require('../models/user')

module.exports = {

    login: async (req, res) => {
        /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'Login'
            #swagger.description = 'Login with username and password'
            _swagger.deprecated = true
            _swagger.ignore = true
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    username: 'test',
                    password: '1234'
                }
            }
        */


//! Frontend yazilimcisi Access tokeni sessiona, refresh tokeni cookiese saklayarak bir kurgu yapmasi lazim. Access token suresi bitince tekrar cookiesde sakli olan refresh tokenle http://127.0.0.1:8000/auth/refresh adresine istek atarak access tokeni asagida goruldugu gibi yenileyerek kullanicinin uygulamadan atilmamasini saglar 

        const { username, password } = req.body

        if (username && password) {

            const user = await User.findOne({ username, password }) // burda set ile passwordu sifrelememe sebebimiz arka planda findOne icin set metodu calisiyor olmasi

            if (user) {

                if (user.isActive) {

                    // res.send({
                    //     error: false,
                    //     token: {
                    //         access: jwt.sign(user.toJSON(), process.env.ACCESS_KEY, { expiresIn: '10m' }),       //* jwt.sign=token olusturma komutu - (user datasini JSON(jwt.sign bizden JSON bekler) olarak pas gec, access tokeni sifreleme, omru ne kadar olacak) - her bilgi yollanabilir
                    //         refresh: jwt.sign({ _id: user._id, password: user.password }, process.env.REFRESH_KEY, { expiresIn: '3d' }),      //* ({jwt ye gomulecek data, jwt yi sifreleme anahtari, jwt omru ne kadar olacak}) - sadece kritik bilgiler yollanir id, password, username gibi
                    //     }
                    // })

                    
                    //* Ustteki veriyi asagida data ve send icinde toparlamis olduk 

                    const data = {
                        access: user.toJSON(),
                        refresh: { _id: user._id, password: user.password },
                        shortExpiresIn: '10m',   //* 
                        longExpiresIn: '3d'
                    }

                    res.send({
                        error: false,
                        token: {
                            access: jwt.sign(data.access, process.env.ACCESS_KEY, { expiresIn: data.shortExpiresIn }),
                            refresh: jwt.sign(data.refresh, process.env.REFRESH_KEY, { expiresIn: data.longExpiresIn }),
                        }
                    })

                    res.send({      //jwt.io dan sifrelenmis donutu kontrol edebilirsin
                        error: false,
                        token: setToken(user)
                    })

                } else {

                    res.errorStatusCode = 401
                    throw new Error('This account is not active.')
                }
            } else {

                res.errorStatusCode = 401
                throw new Error('Wrong username or password.')
            }
        } else {

            res.errorStatusCode = 401
            throw new Error('Please enter username and password.')
        }
    },


    //! Kullanici giris yapinca access ve refresh token donusu alacak. Access token kisa sureli oldugu icin suresi bitince bize refresh tokenini gondererek yani bir access token almasi gerekecek. Bunun icinde asagidaki refresh token komutunu yazdik. Access token varken 200 yokken 401 doner, 401 bitince yeni refresh yollanir. Kritik kripto, banka vs gibi uygulamalarinda access token suresi bitince uygulamadan atar, refresh token yoktur. 


    refresh: async (req, res) => {
        /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'Token Refresh'
            #swagger.description = 'Refresh accessToken with refreshToken'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    token: {
                        refresh: '...refreshToken...'
                    }
                }
            }
        */

        const refreshToken = req.body?.token?.refresh

        if (refreshToken) {

            jwt.verify(refreshToken, process.env.REFRESH_KEY, async function (err, userData) {  //* gelen refresh tokeni al, bu key ile sifrelemeyi coz,(bana ya error ver ya da userData dondur))

                if (err) {

                    res.errorStatusCode = 401
                    throw err
                } else {   

                    const { _id, password } = userData    // hata almazsam access tokeni yeniden almak icin id ve sifreye ulas

                    if (_id && password) {

                        const user = await User.findOne({ _id }) // Burada ikinci defa sifreleme yapilmasin diye password yerine id yolladik

                        if (user && user.password == password) {

                            if (user.isActive) {

                                // const data = {
                                //     access: user.toJSON(),
                                //     refresh: { _id: user._id, password: user.password },
                                //     shortExpiresIn: '10m',
                                //     longExpiresIn: '3d'
                                // }

                                // res.send({
                                //     error: false,
                                //     token: {
                                //         access: jwt.sign(data.access, process.env.ACCESS_KEY, { expiresIn: data.shortExpiresIn }),
                                //         refresh: null    //refresh yaparaken refresh token yollamaya gerek yok - 3 gun sonra tekrar giris yapilmasi gerekir. refresh tokende versek kullanici suresiz olarak acik kalir
                                //     }
                                // })

                                res.send({
                                    error: false,
                                    token: setToken(user, true)
                                })

                            } else {

                                res.errorStatusCode = 401
                                throw new Error('This account is not active.')
                            }
                        } else {

                            res.errorStatusCode = 401
                            throw new Error('Wrong id or password.')
                        }
                    } else {

                        res.errorStatusCode = 401
                        throw new Error('Please enter id and password.')
                    }
                }
            })

        } else {
            res.errorStatusCode = 401
            throw new Error('Please enter token.refresh')
        }
    },

    logout: async (req, res) => {
        /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'Logout'
            #swagger.description = 'No need any doing for logout. You must deleted Bearer Token from your browser.'
        */

        res.send({
            error: false,
            message: 'No need any doing for logout. You must deleted Bearer Token from your browser.'
        })

    },

}
