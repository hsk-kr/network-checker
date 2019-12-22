const express = require("express");
const router = express.Router();
const user = require("./controllers/user");
const chkinfo = require('./controllers/checkInformation');

router.post("/signup", user.joinUser);
router.post("/signin", user.loginUser);

// APIs for autorized users
router.use(require("./middlewares/verifytoken"));
router.get("/myuser", user.getMyUser);
router.get("/mychkinfo", chkinfo.getMyCheckInformation);
router.post("/mychkinfo", chkinfo.createMyCheckInformation);
router.put("/mychkinfo/:id", chkinfo.updateMyCheckInformation);
router.delete("/mychkinfo/:id", chkinfo.deleteMyCheckInformation);

// APIs for admin
router.use(require("./middlewares/verifyadmin"));

// User
router.get("/admin/user", user.getUsers);
router.get("/admin/user/:id", user.getUser);
router.put("/admin/user/:id", user.putUser);
router.delete("/admin/user/:id", user.deleteUser);
router.post("/admin/user", user.createUser);

// CheckInformation
router.get("/admin/chkinfo", chkinfo.getCheckInformation);
router.get("/admin/chkinfo/:id", chkinfo.getOneCheckInformation);
router.put("/admin/chkinfo/:id", chkinfo.putCheckInformation);
router.delete("/admin/chkinfo/:id", chkinfo.deleteCheckInformation);
router.post("/admin/chkinfo", chkinfo.createCheckInformation);


module.exports = router;