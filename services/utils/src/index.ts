import express from 'express'
import cloudinary from"cloudinary"
import cors from "cors"
// import connectDB from './config/db.js';
import uploadRoutes from "./routes/cloudinary.js"
import dotenv from 'dotenv'
dotenv.config()


const app = express()
app.use(cors())
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:"50mb",extended:true}))
const {CLOUD_NAME,CLOUD_API_KEY,CLOUD_API_SECRET}=process.env
if(!CLOUD_NAME||!CLOUD_API_KEY ||!CLOUD_API_SECRET){
  throw new Error("Missing Cloudinary environment variables")
}
cloudinary.v2.config({
  cloud_name:CLOUD_NAME,
  api_key:CLOUD_API_KEY,
  api_secret:CLOUD_API_SECRET
})

app.use("/api",uploadRoutes)
  
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Util service is running on port ${PORT}`);
  // connectDB();
});