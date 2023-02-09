const express = require("express");
const api = express.Router();
const { verifyJwt } = require("../middlewares/verifyJwt");
const {
	handleGetAllCustomers,
	handleCreateCustomer,
	handleUpdateCustomer,
	handleDeleteCustomer,
} = require("../controller/customerController");
const { verifyRoles } = require("../middlewares/verifyRoles");

api.get("/", verifyJwt, verifyRoles([3232, 4848]), handleGetAllCustomers);
api.post("/", handleCreateCustomer);
api.put("/:custId", handleUpdateCustomer);
api.delete("/:custId", handleDeleteCustomer);

module.exports = api;
