// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async()=>{
    try {
        mongoose.connect(`${process.env.MONGO_URI}`);
        
        const connection = mongoose.connection;
        
        
        connection.on("connected",()=>{
            console.log("MongoDb connected");
        })

        connection.on("error",(err)=>{
            console.log("mongodb connection error "+err);
            process.exit(0);
        })

        


    } catch (error) {
        console.log("MongoDB connection error "+error);
        await mongoose.connection.close();
        process.exit(0);
    }
}

export default connectDB;
