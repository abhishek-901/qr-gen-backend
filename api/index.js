const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const connectDB = require("../config/db");
const userRoute = require("../Route/userRoute");

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

connectDB();
app.use("/userapi", userRoute);

module.exports = serverless(app);
