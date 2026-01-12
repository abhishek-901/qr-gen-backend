require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

app.use(cors({
    origin: "https://ultimateqr-seven.vercel.app"
}));

app.use(express.json());

connectDB();

app.use("/userapi", userRoute);

module.exports = serverless(app);
