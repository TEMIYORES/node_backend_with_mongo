const express = require("express");
const router = express.Router();
const LogoutController = require("../controllers/LogoutController");

router.route("/").get(LogoutController.handleLogout);

module.exports = router;
