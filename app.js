const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// deklarasi routes
const lemburRoutes = require('./api/routes/lemburs')
const cutiRoutes = require('./api/routes/cutis')
const userRoutes = require('./api/routes/users')

mongoose.connect('mongodb+srv://pklsijadb:' + process.env.MONGO_ATLAS_PW + '@pklsijadb.taswq.mongodb.net/pklsijadb?retryWrites=true&w=majority', {})
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

// routes
app.use('/lembur', lemburRoutes)
app.use('/cuti', cutiRoutes)
app.use('/user', userRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found!')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app