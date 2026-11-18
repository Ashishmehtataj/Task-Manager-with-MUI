import type {Request, Response, NextFunction } from "express";
import User from "../model/User.js";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request{
    userId?:string,
}

interface payload{
    email:string,
    id:string,
}

const authMiddleware = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
    try{
        const header = req.headers.authorization;
        if(!header || !header.startsWith("Bearer ")){
            res.status(400).json({
                success:false,
                message:"Token not found"
            })
            return;
        }

        const token = header.split(" ")[1]

        const verifyToken = jwt.verify(token as string,process.env.JWT_SECRET_KEY as string) as payload;
        if(!verifyToken){
            res.status(400).json({
                success:false,
                message:"Invalid token"
            })
            return;
        }

        const user = await User.findOne({email:verifyToken.email})
        if(!user){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
            return;
        }
        (req as AuthRequest).userId = user._id.toString()
        next()
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:"Internal server error while add auth middleware "+err.message
        })
        return;
    }
}

export default authMiddleware;