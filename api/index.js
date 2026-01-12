require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

// ✅ CORS (ONLY THIS)
app.use(cors({
    origin: "https://ultimateqr-seven.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ DB
connectDB();

// ✅ Routes
app.use("/userapi", userRoute);

// ✅ SINGLE export (IMPORTANT)
module.exports = serverless(app);
