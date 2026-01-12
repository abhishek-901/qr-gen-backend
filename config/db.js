const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        isConnected = true;
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("DB Error", err.message);
        throw err;
    }
};

module.exports = connectDB;
