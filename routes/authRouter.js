const { Router } = require('express');
const authRouter = Router();
const authController = require("../controllers/authController");

authRouter.get('/login', authController.renderLoginForm);
authRouter.get('/log-out', authController.logoutUser)
authRouter.get('/register', authController.renderRegisterForm);

authRouter.post('/login', authController.loginUser)
authRouter.post('/register', authController.registerUser);

module.exports = authRouter;