import mongoose from "mongoose";

export default async function connectToMongo() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}