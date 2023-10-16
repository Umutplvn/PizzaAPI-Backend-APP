"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

//! User Model:

const passwordEncrypt= require('../helpers/passwordEncrypt')
const UserSchema = new mongoose.Schema({    //erd diyagramina bakark yazilir

    username:{
        type:String,
        trim: true,
        required: true,
        unique: true
    },
    password:{
        type:String,
        trim: true,
        required: true,
        unique: false,
        set:(password)=>passwordEncrypt(password)   // girilen sifreyi sifreleyerek kaydetmemizi saglayan metod
    },
    email:{
        type:String,
        trim: true,
        required: [true, 'Email field is required'],    // true/false yerine [t/f, hatamesaji] seklindede yazilabilir
        unique: [true, 'This email address is already exist'],
        validate:[
            (email)=>email.includes('@') && email.includes('.'), 'Email is not valid'
        ]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }


},{collection:'users', timestamps:true})

module.exports=mongoose.model('User', UserSchema) 