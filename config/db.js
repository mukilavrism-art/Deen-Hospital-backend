const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    console.log("MONGO_URL:", process.env.MONGO_URL); // 👈 ADD THIS

    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected");

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;