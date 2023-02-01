const express = require("express");
const {
	handleGetAllAppointMent,
	handleCreateAppointMent,
} = require("../controller/appointmentController");
const api = express.Router();

api.get("/", handleGetAllAppointMent);
api.post("/", handleCreateAppointMent);

module.exports = api;
