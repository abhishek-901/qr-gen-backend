require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

/* ================================
   ✅ PERFECT CORS FOR VERCEL + LOCAL
================================ */

const allowedOrigins = [
    "http://localhost:5173",
    "https://ultimateqr-seven.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // postman / curl
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

/* Preflight must be handled */
app.options("*", cors());

app.use(express.json());

connectDB();

/* Routes */
app.use("/userapi", userRoute);

/* For Vercel */
module.exports = serverless(app);
