require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http")

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// MongoDB connect
connectDB();

// Routes
app.use("/userapi", userRoute);

module.exports = app
module.exports.handler = serverless(app)


