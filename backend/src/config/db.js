/*
Create a reusable MongoDB connection function for this Express backend.

Requirements:
1. Use mongoose.
2. Read the MongoDB connection string from process.env.MONGO_URI.
3. If MONGO_URI is missing, log an error and exit the process.
4. Connect using mongoose.connect().
5. On successful connection, log "MongoDB connected successfully".
6. On error, log the error message and exit the process with code 1.
7. Export the connectDB function using module.exports.
8. Use CommonJS syntax.
9. Keep the code simple and beginner-friendly.
*/

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing in environment variables");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
