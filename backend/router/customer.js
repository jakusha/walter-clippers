const express = require("express");
const api = express.Router();

const {
	handleGetAllCustomers,
	handleCreateCustomer,
} = require("../controller/customerController");

api.get("/", handleGetAllCustomers);
api.post("/", handleCreateCustomer);

module.exports = api;
