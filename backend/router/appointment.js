const express = require("express");
const {
	handleGetAllAppointMent,
	handleCreateAppointMent,
	handleUpdateAppointment,
	handleDeleteAppointment,
} = require("../controller/appointmentController");
const api = express.Router();

// api.get("/", handleGetAllAppointMent);
api.get("/:custId", handleGetAllAppointMent);
api.put("/:appointmentId", handleUpdateAppointment);
api.post("/", handleCreateAppointMent);
api.delete("/:appointmentId", handleDeleteAppointment);

module.exports = api;
