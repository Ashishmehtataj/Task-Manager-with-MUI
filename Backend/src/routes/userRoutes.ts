import express from 'express'
import { forgotPassword, login, register, resetPassword } from '../controller/userController.js'

const userRoutes = express.Router()

userRoutes.post("/register",register)
userRoutes.post('/login',login)
userRoutes.post('/forgotpassword',forgotPassword)
userRoutes.post('/resetpassword/:token',resetPassword)

export default userRoutes;
