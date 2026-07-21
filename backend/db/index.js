import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
    }
    catch(error){
        console.log("DB connection fail ",error.message);
    }
}

export default connectDB;