const express = require("express");
const {
	handleLogin,
	handleLogout,
	handleRefreshToken,
} = require("../controller/authController");
const { handleCreateCustomer } = require("../controller/customerController");
const api = express.Router();

api.post("/login/", handleLogin);
api.post("/signup", handleCreateCustomer);
api.get("/logout/", handleLogout);
api.get("/refresh/", handleRefreshToken);

module.exports = api;
