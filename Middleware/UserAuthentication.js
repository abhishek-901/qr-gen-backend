require("dotenv").config();
const jwt = require("jsonwebtoken");
const TokenBlackList = require("../Model/TokenBlackList");

const UserAuthentication = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No token" });
        }

        const token = header.split(" ")[1];

        const blocked = await TokenBlackList.findOne({ token });
        if (blocked) return res.status(401).json({ msg: "Session expired" });

        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = UserAuthentication;
