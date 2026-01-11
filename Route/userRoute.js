const express = require('express');
const router = express.Router();
const uAuth = require("../Middleware/UserAuthentication");
const userController = require('../controller/userController');

// Routes

// Test
router.get("/testuser", uAuth, userController.testuser);

// QR routes
router.get("/getqrlinks", uAuth, userController.getqrlinks);
router.get("/getqr/:qrid", uAuth, userController.getqr);
router.post("/addlinkqr", uAuth, userController.addlinkqr);
router.put("/editqr/:qrid", uAuth, userController.editqr);
router.delete("/deleteqr/:qrid", uAuth, userController.deleteqr);

// User routes
router.post("/reguser", userController.reguser);
router.post("/loguser", userController.loginuser);
router.get("/logoutuser", uAuth, userController.logoutuser);

// Password routes
router.post("/forgetpass", userController.forgetpass);
router.post("/reset-pass/:token", userController.resetpass);

module.exports = router;
