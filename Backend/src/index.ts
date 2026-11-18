import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectToDatabase from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use("/user",userRoutes)
app.use("/task",authMiddleware,taskRoutes)
dotenv.config()

connectToDatabase()
const port = process.env.PORT || 7000

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})