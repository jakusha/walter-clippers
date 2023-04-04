const { Op } = require("sequelize");
const Customer = require("../model/Customer");
const Appointment = require("../model/Appointment");
const calenderSchema = require("../validationjoi/calender/createCalender");

async function handleGetCustomerCalender(req, res) {
	const custId = req.params.custId.toString();
	const month = +req.params.month;
	const year = +req.params.year;

	const { value, error } = calenderSchema.validate({ month, year });
	if (error) {
		return res.status(400).json({ message: error.message });
	}

	try {
		const validCustomer = await Customer.findByPk(custId);

		if (validCustomer) {
			//fund all appointments belonging to a customer in a month
			let condition;
			if (month <= 10) {
				condition = {
					[Op.lte]: `${year}-${month + 2}`,
					[Op.gte]: `${year}-${month + 1}`,
				};
			} else {
				condition = {
					[Op.gte]: `${year}-${month + 1}`,
					[Op.lte]: `${year}-${month + 1}-${31}`,
				};
			}

			let result;

			if (req.user === "admin") {
				result = await Appointment.findAll({
					include: "Customer",
					where: {
						date: {
							[Op.and]: {
								...condition,
							},
						},
					},
				});
			} else {
				result = await Appointment.findAll({
					where: {
						custId: {
							[Op.eq]: custId,
						},
						date: {
							[Op.and]: {
								...condition,
							},
						},
					},
				});
			}

			const dateToAppointment = {};

			for (let i = 0; i < result.length; i++) {
				const appointment = result[i];
				const date = new Date(appointment.date).getDate();

				//orange out appointment date that you booked appointments for, that have passed.
				let passedCurrentDate =
					new Date().toISOString().substring(0, 10) >
					appointment.date;
				if (dateToAppointment[date] !== undefined) {
					dateToAppointment[date].appointmentInfo.push({
						day: date,
						appointment: true,
						appointmentInfo: appointment,
						passedCurrentDate,
					});
				} else {
					dateToAppointment[date] = {
						day: date,
						appointment: true,
						appointmentInfo: [appointment],
						passedCurrentDate,
					};
				}
			}
			const calender = generateFullCalender(
				month,
				year,
				dateToAppointment
			);
			result = result.sort((a, b) => new Date(a.date) - new Date(b.date));

			return res.json({ value, calender, result, dateToAppointment });
		} else {
			return res.status(400).json({ message: "invalid customer id" });
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function handleGenerateCalenderModal(req, res) {
	const month = +req.params.month;
	const year = +req.params.year;
	const custId = req.params.custId;

	const { value, error } = calenderSchema.validate({ month, year });
	if (error) {
		return res.status(400).json({ message: error.message });
	}

	try {
		const validCustomer = await Customer.findByPk(custId);
		if (validCustomer) {
			let condition;
			if (month <= 10) {
				condition = {
					[Op.lte]: `${year}-${month + 2}`,
					[Op.gte]: `${year}-${month + 1}`,
				};
			} else {
				condition = {
					[Op.gte]: `${year}-${month + 1}`,
					[Op.lte]: `${year}-${month + 1}-${31}`,
				};
			}

			const result = await Appointment.findAll({
				where: {
					date: {
						[Op.and]: {
							...condition,
						},
					},
					custId: custId,
				},
			});
			// console.log(result, "RESULT FROM APPOINTMENT!!!!!!11");

			const dateToAppointment = {};

			for (let i = 0; i < result.length; i++) {
				const appointment = result[i];
				const date = new Date(appointment.date).getDate();

				dateToAppointment[date] = {
					day: date,
					appointment: true,
					appointmentInfo: appointment,
				};
			}
			const calender = generateCalenderModal(
				month,
				year,
				new Date().getDate(),
				dateToAppointment
			);
			return res.json({ value, calender, result, dateToAppointment });
		} else {
			return res.status(400).json({ message: "invalid customer id" });
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}
const months = [
	{ value: "January", num: 0 },
	{ value: "February", num: 1 },
	{ value: "March", num: 2 },
	{ value: "April", num: 3 },
	{ value: "May", num: 4 },
	{ value: "June", num: 5 },
	{ value: "July", num: 6 },
	{ value: "August", num: 7 },
	{ value: "September", num: 8 },
	{ value: "October", num: 9 },
	{ value: "November", num: 10 },
	{ value: "December", num: 11 },
];

function getCurrentYear() {
	return new Date().getFullYear();
}

function getCurrentMonth() {
	return new Date().getMonth();
}

function getFirstDay(month, year) {
	let firstDay = new Date(year, month).getDay();

	return firstDay;
}

function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

function generateFullCalender(month, year, previosAppointments) {
	const calender = [];
	const days = daysInMonth(month, year);

	let firstDay = new Date(year, month, 1).getDay();

	for (let i = 0; i < firstDay; i++) {
		calender.push("");
	}

	for (let i = 1; i <= days; i++) {
		const sameDay =
			new Date(`${year}-0${month + 1}-0${i}`).getDate() ===
				new Date(new Date().toISOString().substring(0, 10)).getDate() &&
			new Date(`${year}-0${month + 1}-0${i}`).getMonth() ===
				new Date(
					new Date().toISOString().substring(0, 10)
				).getMonth() &&
			new Date(`${year}-0${month + 1}-0${i}`).getFullYear() ===
				new Date(
					new Date().toISOString().substring(0, 10)
				).getFullYear();
		let condition =
			new Date(`${year}-0${month + 1}-0${i}`) <
			new Date(new Date().toISOString().substring(0, 10));
		let hasPassed = sameDay ? false : condition;

		if (previosAppointments[i]) {
			calender.push({
				...previosAppointments[i],
				hasPassed,
			});
		} else {
			calender.push({
				day: i,
				appointment: false, //show green on calender if true else leave plain
				appointmentInfo: [],
				hasPassed,
			});
		}
	}

	for (let i = firstDay + days; i < 35; i++) {
		calender.push("");
	}

	return calender;
}

//calender modal input
function generateCalenderModal(month, year, currentDay, previosAppointments) {
	const calender = [];
	const days = daysInMonth(month, year);
	let firstDay = new Date(year, month, 1).getDay();

	for (let i = 0; i < firstDay; i++) {
		calender.push("");
	}

	for (let i = 1; i <= days; i++) {
		if (previosAppointments[i]) {
			// calender.push(previosAppointments[i]);
			//invalidate all previous existing appointments in calender
			calender.push({
				day: i,
				date: `${year}-${month}-${i}`,
				invalid: true,
			});
		} else {
			//check if year and month is less than current month and year
			if (
				parseInt(getCurrentYear()) >= parseInt(year) &&
				parseInt(getCurrentMonth()) > parseInt(month)
			) {
				calender.push({
					day: i,
					date: `${year}-${month}-${i}`,
					invalid: true,
				});
			} else {
				//check for current month/year and above
				if (
					i < currentDay &&
					parseInt(getCurrentYear()) === parseInt(year) &&
					parseInt(getCurrentMonth()) === parseInt(month)
				) {
					calender.push({
						day: i,
						date: `${year}-${month}-${i}`,
						invalid: true,
					});
				} else {
					calender.push({
						day: i,
						date: `${year}-${month}-${i}`,
						invalid: false,
					});
				}
			}
		}
	}

	for (let i = firstDay + days; i < 35; i++) {
		calender.push("");
	}

	return calender;
}
module.exports = { handleGetCustomerCalender, handleGenerateCalenderModal };
