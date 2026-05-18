const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We are temporarily hardcoding the URL to bypass the .env cache
    const conn = await mongoose.connect("mongodb+srv://yashvisani45_db_user:Yash1708@cluster0.qu7rn0m.mongodb.net/barbershop?retryWrites=true&w=majority");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;