const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const requireLogin = require("../middleware/requireLogin");

router.get("/", (req, res) => {
  res.send("Hello auth");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello auth protected");
});

router.post("/signup", authController.postSignUp);

router.post("/signin", authController.postSignIn);

module.exports = router;
