const express = require("express");
const {
	handleGetCustomerCalender,
	handleGenerateCalenderModal,
} = require("../controller/calenderController");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { verifyRoles } = require("../middlewares/verifyRoles");

const api = express.Router();

api.get("/:custId/:month/:year/modal", handleGenerateCalenderModal);
api.get(
	"/:custId/:month/:year",
	verifyRoles([3232, 4848]),
	handleGetCustomerCalender
);

module.exports = api;
