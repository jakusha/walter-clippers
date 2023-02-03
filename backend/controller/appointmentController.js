//create an appointment using the customers id
const { Op } = require("sequelize");
const Appointment = require("../model/Appointment");
const appointmentSchema = require("../validationjoi/newAppointment");
const { DateTime } = require("luxon");
const Customer = require("../model/Customer");
const HairStyle = require("../model/HairStyle");
const updateAppointment = require("../validationjoi/updateAppointment");

function validateTime(time, date) {
	const currentTime = DateTime.now();
	console.log(currentTime);
	const timeValid = time >= "08:00" && time <= "22:00" && date > currentTime;

	return timeValid;
}
async function handleCreateAppointMent(req, res) {
	const { value, error } = appointmentSchema.validate(req.body);

	if (error) {
		return res.json({ message: error.message }).status(400);
	}

	const timeValid = validateTime(value.time, value.date);
	console.log(timeValid, "DDAAAATTTTEEEEEEEEE");

	if (!timeValid)
		return res.json({ message: "invalid appointment time" }).status(400);

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
			.json({ message: "appointment date is not available" })
			.status(400);
	console.log(foundAppointment, "found a result ooooooo ~!!!!!!!!");
	try {
		await Appointment.create({
			...value,
		});
	} catch (error) {
		console.log(error, "an error occureddd--------!!!!!", error.message);
		return res.json({ error: error.message }).status(500);
	}

	return res.json({ value, error });
}

//get all appointments belonging to a customer
async function handleGetAllAppointMent(req, res) {
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
			return res.json({ message: "invalid customer id" }).status(400);
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
		return res.json({ message: error.message }).status(400);
	}

	const timeValid = validateTime(value.time, value.date);

	if (!timeValid)
		return res.json({ message: "invalid appointment time" }).status(400);
	try {
		//check valid appointment id
		const result = await Appointment.findByPk(appointmentId);
		if (result) {
			console.log(value, "asdadadasd=======11111110000000000");
			const validHairstyle = await HairStyle.findByPk(value.hairStyleId);
			const validCustomerId = await Customer.findByPk(value.custId);
			if (validHairstyle && validCustomerId) {
				// return res.json({ message: "good data" });

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
						.json({ message: "appointment date is not available" })
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
			} else {
				return res
					.json({ message: "invalid hairstyle or customer id" })
					.status(400);
			}
		} else {
			return res.json({ message: "invalid appointment id" }).status(400);
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}

	return res.json({ value, error });
}

async function handleDeleteAppointment(req, res) {
	const appointmentId = req.params.appointmentId;

	try {
		const result = await Appointment.findByPk(appointmentId);

		console.log(result);
		if (result) {
			await Appointment.destroy({
				where: {
					appointmentId: appointmentId,
				},
			});
			return res.json({ message: "Appointment deleted successfull" });
		} else {
			return res
				.status(400)
				.json({ message: `Appointment ID ${appointmentId} not found` });
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}
}

module.exports = {
	handleCreateAppointMent,
	handleGetAllAppointMent,
	handleUpdateAppointment,
	handleDeleteAppointment,
};
