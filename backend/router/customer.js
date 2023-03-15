const express = require("express");
const api = express.Router();
const { verifyJwt } = require("../middlewares/verifyJwt");
const {
	handleGetAllCustomers,
	handleUpdateCustomer,
	handleDeleteCustomer,
	handleGetCustomer,
} = require("../controller/customerController");
const { verifyRoles } = require("../middlewares/verifyRoles");

api.get("/", verifyRoles([3232, 4848]), handleGetAllCustomers);
api.get("/info", handleGetCustomer);
api.put("/:custId", handleUpdateCustomer);
api.delete("/:custId", handleDeleteCustomer);

module.exports = api;
