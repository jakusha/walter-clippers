const express = require("express");
const {
	handleGetCustomerCalender,
	handleGenerateCalenderModal,
} = require("../controller/calenderController");
const { verifyJwt } = require("../middlewares/verifyJwt");

const api = express.Router();

api.get("/:custId/:month/:year/modal", handleGenerateCalenderModal);
api.get("/:custId/:month/:year", handleGetCustomerCalender);

module.exports = api;
