// lib/dbConnect.ts
"use server"
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// @ts-ignore
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    // agar connection already hai, use return kar do
    return cached.conn;
  }

  if (!cached.promise) {
    // agar promise nahi hai toh connect kar ke promise bana do
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Next.js ke dev mode mein global object pe cache kar rahe hain taaki hot reload mein dobara connect na ho
// @ts-ignore
global.mongoose = cached;

export default dbConnect;
