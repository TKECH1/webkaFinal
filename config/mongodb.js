import mongoose from "mongoose";

export default async function connectToMongo() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}