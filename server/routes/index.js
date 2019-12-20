const express = require("express");
const router = express.Router();
const User = require("./controllers/User");

router.post("/signup", User.joinUser);
router.post("/signin", User.loginUser);

// APIs for autorized users
router.use(require("./middlewares/verifytoken"));
router.get("/myuser", User.getMyUser);

// APIs for admin
router.use(require("./middlewares/verifyadmin"));
router.get("/user", User.getUsers);
router.get("/user/:id", User.getUser);
router.put("/user/:id", User.putUser);
router.delete("/user/:id", User.deleteUser);
router.post("/user", User.createUser);

module.exports = router;