import User from "../model/User.js";
import type { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "User name, email, password and confirmPassword are required for register"
            })
        }

        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm password do not match"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashPassword })
        await user.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "7d" })
        const userData = {
            name: user.name,
            email: user.email,
            id: user._id
        }

        return res.status(201).json({
            success: true,
            message: "User registered, redirect to login page",
            data: userData,
            token: token
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while user registered " + err.message,
        })
    }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "User email and password are required for Login"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "User password is invalid",
            })
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '7d' })
        const userData = {
            name: user.name,
            email: user.email,
            id: user._id
        }

        return res.status(200).json({
            success: true,
            message: `Hello ${userData.name}, login success, redirect to home page`,
            data: userData,
            token: token
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while login user " + err.message,
        })
    }
}

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email required for forgot password"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not registered"
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
        user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000)

        await user.save()

        const resetURL = `${process.env.CLIENT_URL}/resetpassword/${token}`
        sendEmail(user.email, "Reset password", `Reset your password here :${resetURL}`)

        return res.status(200).json({
            success: true,
            message: "Reset password link is send to your email successful"
        })

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while generate reset password link " + err.message,
        })
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "User password must be at least 6 character"
            })
        }

        const hashedToken = crypto.createHash('sha256').update(req.params.token as string).digest('hex')

        const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: new Date() } })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword,
            user.resetPasswordToken = undefined,
            user.resetPasswordExpire = undefined,

            await user.save()

        return res.status(200).json({
            success: true,
            message: "User password changed, please log in"
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while reset Password " + err.message,
        })
    }
}