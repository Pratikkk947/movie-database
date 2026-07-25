import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env',
})
 const dbConnection=async()=>{
    try{
       
       await mongoose.connect(process.env.MONGODB_URL)
       console.log(`MongoDB successfully connected `)
    }catch(error){
        console.log(`MongoDB cannot be connected ${error.message}`)
        process.exit()
    }

}
export default dbConnection;