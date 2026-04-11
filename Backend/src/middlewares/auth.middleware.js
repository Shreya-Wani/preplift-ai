const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model.js')

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Token Not Found"
        })
    }

    const isTokenBlackListed = await tokenBlacklistModel.findOne({
        token
    })

    if(isTokenBlackListed) {
        return res.status(401).json({
            message: "Token is BlackListed. please login again."
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    }
    catch(err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

module.exports = authUserMiddleware