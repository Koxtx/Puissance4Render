const express = require("express");
const { signupUser, loginUser } = require("../controllers/user-controller");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", loginUser);

module.exports = router;
