const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

// modules for uploading file
// const multer = require('multer')
// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null, './uploads')
//     },
//     filename:function(req,file,cb){
//         cb(null,Date.now() + file.originalname)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     //reject file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null, true)
//     }else {
//         cb(null, false)
//     }
// }

// const upload = multer({
//     storage:storage, 
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter:fileFilter
// })

const Lembur = require('../models/lembur')

router.get('/', (req, res, next) => {
    Lembur.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                total: docs.length,
                data: docs
            }
            // if(docs.length >= 0){
            res.status(200).json(response)
            // }else {
            //     res.status(404).json({
            //         message: 'No entries'
            //     })
            // }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

// upload.single('lemburImage'),

router.post('/', checkAuth,(req, res, next) => {
    const lembur = new Lembur({
        _id: new mongoose.Types.ObjectId(),
        assignee: req.body.assignee,
        assigner: req.body.assigner,
        reasons: req.body.reasons,
        time: req.body.time,
        // lemburImage: req.file.path
    })
    lembur
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Created form successfully!",
                data: lembur
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

})

router.get('/:lemburId', (req, res, next) => {
    const id = req.params.lemburId
    Lembur.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({
                    message: 'No valid'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

router.patch('/:lemburId', (req, res, next) => {
    const id = req.params.lemburId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Lembur.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({ result })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:lemburId', (req, res, next) => {
    const id = req.params.lemburId
    Lembur.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Deleted'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router