const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller.js');


const authRouter = express.Router();


authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/logout', logoutUser);


module.exports = authRouter;