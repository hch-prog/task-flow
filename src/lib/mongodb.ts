import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env file');
}

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};