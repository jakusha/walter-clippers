const express = require("express");
const {
	handleLogin,
	handleLogout,
	handleRefreshToken,
} = require("../controller/authController");
const api = express.Router();

api.post("/login/", handleLogin);
api.get("/logout/", handleLogout);
api.get("/refresh/", handleRefreshToken);

module.exports = api;
