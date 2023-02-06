const express = require("express");
const api = express.Router();

const {
	handleGetAllCustomers,
	handleCreateCustomer,
	handleUpdateCustomer,
	handleDeleteCustomer,
} = require("../controller/customerController");

api.get("/", handleGetAllCustomers);
api.post("/", handleCreateCustomer);
api.put("/:custId", handleUpdateCustomer);
api.delete("/:custId", handleDeleteCustomer);

module.exports = api;
