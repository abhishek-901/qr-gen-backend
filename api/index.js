require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

app.use(express.json());

/* ✅ FULL CORS FIX */
app.use(cors({
    origin: [
        "https://ultimateqr-seven.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

/* ✅ Preflight */
app.options("*", cors());

connectDB();

app.use("/userapi", userRoute);

module.exports = app;
module.exports.handler = serverless(app);
