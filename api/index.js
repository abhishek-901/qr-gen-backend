require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

// ✅ Body parser
app.use(express.json());

// 🔥 CORS fix for serverless + Vercel
app.use((req, res, next) => {
    // Allow frontend URL
    res.setHeader("Access-Control-Allow-Origin", "https://ultimateqr-seven.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Preflight request
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/userapi", userRoute);

// ✅ Serverless export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
