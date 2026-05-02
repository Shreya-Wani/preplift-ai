const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware.js')
const interviewController = require('../controllers/interview.controller.js')
const upload = require('../middlewares/file.middleware.js')

const interviewRouter = express.Router()

// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
    if (err) {
        return res.status(400).json({
            message: "File upload error: " + err.message
        })
    }
    next()
}

interviewRouter.post("/", 
    authMiddleware, 
    (req, res, next) => {
        upload.single('resume')(req, res, (err) => {
            handleMulterError(err, req, res, next)
        })
    }, 
    interviewController.generateInterviewReport
)

module.exports = interviewRouter