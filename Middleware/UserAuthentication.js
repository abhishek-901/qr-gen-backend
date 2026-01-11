require('dotenv').config();
const jwt = require("jsonwebtoken");
const TokenBlackList = require('../Model/TokenBlackList');

const UserAuthentication = async (req, res, next) => {
    const header = req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
        return res.json({ "token_sts": "1", "msg": "Authorization token not found or invalid" })
    } else {
        const token = header.split(" ")[1];
        const isBlackList = await TokenBlackList.findOne({ token: token });
        if (isBlackList) {
            res.json({ "token_sts": "3", "msg": "Token is blacklisted. Please log in again." })
            return;
        }
        try {
            const verified = jwt.verify(token, process.env.JWT_USER_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            return res.json({ "token_sts": "2", "msg": error.message })
        }

    }
}

module.exports = UserAuthentication;