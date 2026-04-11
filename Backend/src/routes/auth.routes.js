const express = require('express');
const authMiddlware = require('../middlewares/auth.middleware.js');
const { registerUser, loginUser, logoutUser, getMeUser } = require('../controllers/auth.controller.js');

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/logout', logoutUser);
authRouter.get('/get-me', authMiddlware,  getMeUser)

module.exports = authRouter;