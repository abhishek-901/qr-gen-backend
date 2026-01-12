const express = require("express");
const router = express.Router();
const uAuth = require("../Middleware/UserAuthentication");
const user = require("../controller/userController");

router.post("/reguser", user.reguser);
router.post("/loginuser", user.loginuser);
router.get("/logoutuser", uAuth, user.logoutuser);

router.get("/getqrlinks", uAuth, user.getqrlinks);
router.get("/getqr/:qrid", uAuth, user.getqr);
router.post("/addlinkqr", uAuth, user.addlinkqr);
router.put("/editqr/:qrid", uAuth, user.editqr);
router.delete("/deleteqr/:qrid", uAuth, user.deleteqr);

router.post("/forgetpass", user.forgetpass);
router.post("/reset-pass/:token", user.resetpass);

module.exports = router;
