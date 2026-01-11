require('dotenv').config();
const sendMail = require("../utils/sendMail");
const UserModel = require('../Model/User');
const LinqQRModel = require('../Model/LinkQr');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const TokenBlackListModel = require('../Model/TokenBlackList');
const crypto = require('crypto');
const ResetPassModel = require('../Model/ResetPass');

// ------------------ Controller Functions ------------------

// Test route
exports.testuser = async (req, res) => {
    res.json({ msg: "This is just a test User Route" });
};

// Add QR link
exports.addlinkqr = async (req, res) => {
    const { qrlink, qrcolor } = req.body;
    const user = req.user.id;

    try {
        const newLinkQr = new LinqQRModel({ qrlink, qrcolor, user });
        const saveQR = await newLinkQr.save();
        res.json({ saveQR });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all QR links for user
exports.getqrlinks = async (req, res) => {
    try {
        const qrlinks = await LinqQRModel.find({ user: req.user.id });
        res.json({ qrlinks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single QR by ID
exports.getqr = async (req, res) => {
    const { qrid } = req.params;
    try {
        const qr = await LinqQRModel.findById(qrid);
        if (!qr) return res.status(404).json({ msg: "QR not found" });
        res.json({ qr });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Delete QR
exports.deleteqr = async (req, res) => {
    const { qrid } = req.params;
    try {
        const deletedQr = await LinqQRModel.findByIdAndDelete(qrid);
        if (!deletedQr) return res.status(404).json({ msg: "QR not found" });
        res.json({ msg: "QR deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Edit QR
exports.editqr = async (req, res) => {
    const { qrid } = req.params;
    const { qrlink, qrcolor } = req.body;
    try {
        const qr = await LinqQRModel.findByIdAndUpdate(
            qrid,
            { qrlink, qrcolor },
            { new: true }
        );
        if (!qr) return res.status(404).json({ msg: "QR not found" });
        res.json({ msg: "QR updated", qr });
    } catch (error) {
        res.status(500).json({ msg: "Update failed" });
    }
};

// -------- Register User --------
exports.reguser = async (req, res) => {
    const { uname, uemail, upass } = req.body;

    try {
        // Check if user already exists
        let user = await UserModel.findOne({ user_email: uemail });

        const hashedPass = await bcrypt.hash(upass, 12);

        if (user) {
            // ✅ update existing user
            user.user_name = uname;
            user.user_pass = hashedPass;
            await user.save();
            return res.json({ msg: "User updated successfully" });
        } else {
            // ✅ create new user
            user = new UserModel({
                user_name: uname,
                user_email: uemail,
                user_pass: hashedPass
            });
            await user.save();
            return res.json({ msg: "User registered successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// -------- Login User --------
exports.loginuser = async (req, res) => {
    const { uemail, upass } = req.body;
    try {
        const user = await UserModel.findOne({ user_email: uemail });
        if (!user) return res.status(400).json({ loginsts: "1", msg: "User not found" });

        const isMatch = await bcrypt.compare(upass, user.user_pass);
        if (!isMatch) return res.status(400).json({ loginsts: "2", msg: "Incorrect password" });

        const token = jwt.sign({ id: user._id, user_email: user.user_email }, process.env.JWT_USER_SECRET, { expiresIn: '1d' });
        res.json({ loginsts: "0", msg: "Login Successful", token });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Logout user
exports.logoutuser = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ msg: "No token found" });

    try {
        const newBlackList = new TokenBlackListModel({ token });
        const saved = await newBlackList.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Forget password
exports.forgetpass = async (req, res) => {
    try {
        const { uemail } = req.body;

        const user = await UserModel.findOne({ user_email: uemail });
        if (!user) {
            return res.status(404).json({ msg: "Email not registered" });
        }

        // generate token
        const token = crypto.randomBytes(32).toString("hex");
        const hash = crypto.createHash("sha256").update(token).digest("hex");

        // delete old tokens
        await ResetPassModel.deleteMany({ userId: user._id });

        // save new token
        await ResetPassModel.create({
            userId: user._id,
            reset_token: hash,
            expiresAt: Date.now() + 15 * 60 * 1000
        });

        const resetLink = `${process.env.CLIENT_URL}/reset-pass/${token}`;

        // SEND EMAIL
        await sendMail(
            user.user_email,
            "Reset Your Password",
            `
            <h2>Password Reset</h2>
            <p>Click below to reset your password</p>
            <a href="${resetLink}">${resetLink}</a>
            `
        );

        console.log("Reset link:", resetLink);

        res.json({ msg: "Reset link sent to your email 📧" });

    } catch (err) {
        console.log("FORGET ERROR:", err);
        res.status(500).json({ msg: "Email send failed" });
    }
};


// Reset password
exports.resetpass = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
        const resetToken = await ResetPassModel.findOne({ reset_token: hashToken, expiresAt: { $gt: new Date() } });
        if (!resetToken) return res.json({ resets: "1", msg: "Invalid or expired link" });

        const hashedPass = await bcrypt.hash(password, 12);
        await UserModel.findByIdAndUpdate(resetToken.userId, { user_pass: hashedPass });
        await ResetPassModel.deleteMany({ userId: resetToken.userId });

        res.json({ resets: "0", msg: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
