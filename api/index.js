require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

/* 🔥 THIS FIXES YOUR CORS FOREVER */
app.use(cors({
    origin: [
        "https://ultimateqr-seven.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());

connectDB();

/* Routes */
app.use("/userapi", userRoute);

/* IMPORTANT for preflight */
app.options("*", cors());

module.exports = app;
module.exports.handler = serverless(app);
