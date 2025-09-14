import mongoose from "mongoose"

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/code-sync"

export async function connectToDatabase(): Promise<void> {
	if (mongoose.connection.readyState === 1) return
	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000,
		})
		console.log("Connected to MongoDB")
	} catch (error) {
		console.error("MongoDB connection error:", error)
		throw error
	}
}

export default mongoose

