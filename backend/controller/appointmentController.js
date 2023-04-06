//create an appointment using the customers id
const { Op } = require("sequelize");
const Appointment = require("../model/Appointment");
const Transactions = require("../model/Transactions");
const newAppointmentSchema = require("../validationjoi/appointments/newAppointment");
const availableTimeSchema = require("../validationjoi/appointments/getAvailableAppointments");
const { DateTime } = require("luxon");
const Customer = require("../model/Customer");
const HairStyle = require("../model/HairStyle");
const updateAppointment = require("../validationjoi/appointments/updateAppointment");
const {
	emailFunction,
	newAppointment,
	updateAppointment: updateEmailAppointment,
	deleteAppointment,
} = require("../config/emailMessages");

function validateTime(time, date) {
	const currentDate = new Date().toISOString().substring(0, 10);
	date = new Date(date).toISOString().substring(0, 10);

	let timeValid;
	if (date <= currentDate) {
		timeValid =
			time >= "08:00" &&
			time <= "22:00" &&
			date >= currentDate &&
			parseInt(time) > DateTime.now().hour;
	} else {
		timeValid = time >= "08:00" && time <= "22:00" && date >= currentDate;
	}
	return timeValid;
}

async function handleCreateAppointMent(req, res) {
	const custId = req.params.custId;

	try {
		const validCustomer = await Customer.findByPk(custId);
		if (validCustomer) {
			const { value, error } = newAppointmentSchema.validate(req.body);

			if (error) {
				return res.status(400).json({ error: error.message });
			}

			const timeValid = validateTime(value.time, value.date);

			if (!timeValid)
				return res
					.status(400)
					.json({ error: "invalid appointment time" });

			//check if user already has appointment on that date (1 user 1 appointment per day)
			const appointment = await Appointment.findOne({
				where: {
					[Op.and]: [{ custId: custId }, { date: value.date }],
				},
			});

			if (appointment) {
				return res.status(400).json({
					message:
						"appointment date is not available, you cant create more than one appointment per day",
				});
			}

			//check if time and date is available
			const foundAppointment = await Appointment.findOne({
				where: {
					[Op.and]: [
						{ time: value.time },
						{ date: value.date },
						{ cancelled: false },
					],
				},
			});

			if (foundAppointment)
				return res
					.status(400)
					.json({ message: "appointment date is not available" });
			const result = await Appointment.create({
				...value,
				custId,
			});

			// console.log(
			// 	result,
			// 	result.appointmentId,
			// 	req.body.payment.reference,
			// 	result.appointmentId,
			// 	"APPOINTMENT CREATION"
			// );
			let transaction = "transactions";
			if (result) {
				transaction = await Transactions.create({
					transactionId: req.body.payment.reference,
					appointmentId: result.appointmentId,
				});
			}

			const hairstyleInfo = await HairStyle.findByPk(value.hairStyleId);
			emailFunction(
				"New Haircut Appointment",
				newAppointment(
					hairstyleInfo.name,
					hairstyleInfo.price,
					value.time,
					value.date
				),
				req.email
			);

			return res.json({
				result,
				message: "successfully created anappointment",
				hairstyleInfo,
				transaction,
			});
		} else {
			return res.status(400).json({ error: "invalid customer id" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

//get all appointments belonging to a customer
async function handleGetAllCustomerAppointMent(req, res) {
	const custId = req.params.custId;
	//check if its a valid customer id
	try {
		const validCustomer = await Customer.findByPk(custId);
		if (validCustomer) {
			let result;
			if (req.user === "admin") {
				result = await Appointment.findAll();
			} else {
				result = await Appointment.findAll({
					where: {
						custId,
					},
				});
			}

			return res.json({ custId, result });
		} else {
			return res.json({ error: "invalid customer id" }).status(400);
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}
}

async function handleUpdateAppointment(req, res) {
	//validate harstyle id
	//validate customer id
	//validate date
	//validate time

	const appointmentId = req.params.appointmentId;
	// updatereq.body;
	const { value, error } = updateAppointment.validate(req.body);

	if (error) {
		return res.json({ error: error.message }).status(400);
	}

	try {
		//check valid appointment id
		const result = await Appointment.findByPk(appointmentId);

		if (result) {
			const timeValid = validateTime(value.time, value.date);
			if (!timeValid)
				return res
					.json({ error: "invalid appointment time" })
					.status(400);

			const validHairstyle = await HairStyle.findByPk(value.hairStyleId);
			const validCustomerId = await Customer.findByPk(value.custId);

			if (validHairstyle && validCustomerId) {
				//check if time and date is available
				const foundAppointment = await Appointment.findOne({
					where: {
						[Op.and]: [
							{ time: value.time },
							{ date: value.date },
							{ cancelled: false },
						],
					},
				});

				if (foundAppointment)
					return res
						.json({ error: "appointment date is not available" })
						.status(400);

				await Appointment.update(
					{
						...value,
					},
					{
						where: {
							appointmentId: appointmentId,
						},
					}
				);

				const hairstyleInfo = await HairStyle.findByPk(
					value.hairStyleId
				);
				emailFunction(
					"Update Haircut Appointment",
					updateEmailAppointment(
						hairstyleInfo.name,
						hairstyleInfo.price,
						value.time,
						value.date
					),
					req.email
				);
				return res.status(202).json({ message: "appointment updated" });
			} else {
				return res
					.status(400)
					.json({ error: "invalid hairstyle or customer id" });
			}
		} else {
			return res.status(400).json({ error: "invalid appointment id" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

async function handleDeleteAppointment(req, res) {
	const appointmentId = req.params.appointmentId;

	try {
		const result = await Appointment.findByPk(appointmentId);
		if (result) {
			await Transactions.destroy({
				where: {
					appointmentId: appointmentId,
				},
			});
			await Appointment.destroy({
				where: {
					appointmentId: appointmentId,
				},
			});
			emailFunction(
				"Haircut Appointment Deleted",
				deleteAppointment(result.date),
				req.email
			);
			return res.json({ message: "Appointment deleted successfull" });
		} else {
			return res
				.status(400)
				.json({ error: `Appointment ID ${appointmentId} not found` });
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}
}

async function handleGetRecentAppointment(req, res) {
	const custId = req.params.custId;

	//check if its a valid customer id
	try {
		const validCustomer = await Customer.findByPk(custId);
		if (validCustomer) {
			const result = await Appointment.findAll({
				where: {
					custId,
				},
			});

			return res.json({ custId, result });
		} else {
			return res.json({ error: "invalid customer id" }).status(400);
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}
}

function validAvalilableTime(time, date) {
	//all times less than current date and time are invalid

	date = new Date(date).toISOString().substring(0, 10);
	const currentDate = new Date().toISOString().substring(0, 10);
	const timeNotValid =
		DateTime.now().hour >= parseInt(time) && currentDate >= date;

	return timeNotValid;
}

// Single page application, is a site that has a single page with dynamic contents based on the URL (and other things).
async function handleGetAvailableTime(req, res) {
	//remember to increase month by 1 for valid date
	const { date } = req.params;
	const { value, error } = availableTimeSchema.validate({ date });

	if (error) {
		return res.status(400).json({ error: error.message });
	}
	const times = {
		"07:00:00": true,
		"08:00:00": true,
		"09:00:00": true,
		"10:00:00": true,
		"11:00:00": true,
		"12:00:00": true,
		"13:00:00": true,
		"14:00:00": true,
		"15:00:00": true,
		"16:00:00": true,
		"17:00:00": true,
		"18:00:00": true,
		"19:00:00": true,
	};
	const result = await Appointment.findAll({
		attributes: ["time"],
		where: {
			date: date,
			cancelled: false,
			completed: false,
		},
	});

	for (let i = 0; i < result.length; i++) {
		times[result[i].time] = false;
	}

	const times2 = { ...times };

	for (let time in times2) {
		if (validAvalilableTime(time.slice(0, 5), date)) {
			//checks if its not valid
			times2[time] = false;
		} else {
			if (times2[time] !== false) {
				times2[time] = true;
			}
		}
	}

	res.json({ date, value, message: error?.message, times: times2 });
}

async function handleGetAppointmentInfo(req, res) {
	const appointmentId = req.params.appointmentId;
	try {
		const result = await Appointment.findByPk(appointmentId);

		if (result) {
			const result = await Appointment.findByPk(appointmentId);
			return res.json({ result });
		} else {
			return res
				.status(400)
				.json({ error: `Appointment ID ${appointmentId} not found` });
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}
}

module.exports = {
	handleCreateAppointMent,
	handleGetAllCustomerAppointMent,
	handleUpdateAppointment,
	handleDeleteAppointment,
	handleGetAvailableTime,
	handleGetAppointmentInfo,
};
