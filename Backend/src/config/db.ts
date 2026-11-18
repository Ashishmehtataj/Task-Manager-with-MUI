import mongoose from 'mongoose'
import process from 'process'

const connectToDatabase = async():Promise<void> =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        console.log("Connected to database")
    }catch(err:any){
        console.log("Error found while connected to database "+err.message)
        process.exit(1)
    }
}

export default connectToDatabase;