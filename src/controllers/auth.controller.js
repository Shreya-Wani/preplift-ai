const userModel = require('../models/user.model.js');

async function registerUser(req, res) {

    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({ 
        $or: [ { username }, { email } ]
    });

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with the same username or email already exists"
        })
    }
}

module.exports = {
    registerUser
};