import mongoose,{Document, Schema} from "mongoose";
import { deflate } from "node:zlib";

export interface UDATA extends Document{
    name:string,
    email:string,
    password:string,
    resetPasswordToken?:string | undefined,
    resetPasswordExpire?:Date | undefined
}

export const userSchema = new mongoose.Schema<UDATA>({
    name:{
        type:String,
        required:[true,"User name are required"],
        trim:true,
        minlength:[3,"User name must be at least 3 character's"]
    },
    email:{
        type:String,
        required:[true,"User email are required"],
        unique:[true,"Email are already taken, please enter another email"],
    },
    password:{
        type:String,
        required:[true,"User password are required"],
        minlength:[6,"User password must be at least 6 character's"]
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    }
},{timestamps:true})

const User = mongoose.model<UDATA>("User",userSchema)
export default User;