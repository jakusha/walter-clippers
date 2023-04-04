const express = require("express");
const { verifyJwt } = require("../middlewares/verifyJwt");
const {
	handleGetAllCustomerAppointMent,
	handleCreateAppointMent,
	handleUpdateAppointment,
	handleDeleteAppointment,
	handleGetAvailableTime,
	handleGetAppointmentInfo,
} = require("../controller/appointmentController");
const { verifyPayment } = require("../middlewares/verifyPayment");
const api = express.Router();

api.get("/customer/:custId", handleGetAllCustomerAppointMent);
api.get("/info/:appointmentId", handleGetAppointmentInfo);
api.put("/update/:appointmentId", handleUpdateAppointment);
api.post("/create/:custId", verifyPayment, handleCreateAppointMent);
api.delete("/delete/:appointmentId", handleDeleteAppointment);
api.get("/availtime/:date", handleGetAvailableTime);

module.exports = api;
