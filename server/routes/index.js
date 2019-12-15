const express = require("express");
const router = express.Router();
const User = require("./controllers/User");

router.post("/user/signup", User.createUser);
router.post("/user/signin", User.loginUser);

// APIs for autorized users
router.use(require("./middlewares/verifytoken"));

// APIs for admin
router.use(require("./middlewares/verifyadmin"));
router.get("/test", (req, res) => res.send("hi"));

module.exports = router;