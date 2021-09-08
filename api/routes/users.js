const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.post('/signup', (req,res,next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: 'Email already taken!'
            })
        }else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                }else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        roles: req.body.roles
                    })
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(200).json({
                            message: "User Created!"
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error:err
                        })
                    })
                }
            })
        }
    })
})

router.post('/signin',  (req,res,next) =>{
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length <1 ) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, hasil) => {
            if (err){
                return res.status(401).json({
                    message: 'Auth failed'
                }) 
            }
            if (hasil) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                }
                )
                return res.status(200).json({
                    message: "Auth successfull",                
                    token: token
                })
            }
            res.status(401).json({
                message: 'Auth failed'
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

router.delete('/:userId', (req,res,next) => {
    User.remove({_id:req.params.userId})
    .exec()
    .then(hasil => {
        res.status(200).json({message:'User deleted'})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router