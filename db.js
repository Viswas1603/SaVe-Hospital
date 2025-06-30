// db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();  // Loads MONGO_URI from .env file

const uri = process.env.MONGO_URI; // Secure MongoDB connection URI
const client = new MongoClient(uri);

async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log("✅ MongoDB Connected");
  }
  return client.db("SaVehospital"); // Use your actual DB name
}

module.exports = connectDB;