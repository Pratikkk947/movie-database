import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URL;
        if (!uri) {
            throw new Error("No MongoDB connection URI provided in environment variables.");
        }
        await mongoose.connect(uri);
        console.log(`MongoDB successfully connected`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default dbConnection;
