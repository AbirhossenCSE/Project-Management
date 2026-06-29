import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not set. Add it to your environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
}

export default connectDB;
