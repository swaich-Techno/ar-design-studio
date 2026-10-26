import { setDefaultResultOrder } from "node:dns";
import mongoose from "mongoose";

try {
  setDefaultResultOrder("ipv4first");
} catch {
  // Ignore if the runtime has no dns module.
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

function mongoUri() {
  return String(process.env.MONGODB_URI || "").trim();
}

export function isDatabaseError(error) {
  const detail = `${error?.name || ""} ${error?.code || ""} ${error?.message || ""}`;
  return (
    error?.code === "DB_UNAVAILABLE" ||
    /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|ENETUNREACH|querySrv|MongoNetwork|MongoServerSelection|MongooseServerSelection|MONGODB_URI|topology|bufferCommands/i.test(
      detail
    )
  );
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  const uri = mongoUri();
  if (!uri) {
    const error = new Error("MONGODB_URI is required");
    error.code = "DB_UNAVAILABLE";
    throw error;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      family: 4
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
