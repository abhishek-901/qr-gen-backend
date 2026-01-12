require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

/* ✅ CORS – FULL FIX */
app.use(cors({
    origin: "https://ultimateqr-seven.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

/* ✅ Preflight fix */
app.options("*", cors());

app.use(express.json());

/* ✅ DB CONNECT – ONLY ONCE */
connectDB();

/* ✅ ROUTES */
app.use("/userapi", userRoute);

/* ✅ SERVERLESS EXPORT (ONLY ONE) */
module.exports = serverless(app);
