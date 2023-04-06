const Appointment = require("../model/Appointment");
const HairStyle = require("../model/HairStyle");
const { Op } = require("sequelize");

async function analyticsInfo(req, res) {
	try {
		let result = await Appointment.findAll({
			where: {
				date: {
					[Op.and]: {
						[Op.gte]: `${2023}-${1}`,
						[Op.lte]: `${2023}-${12}-${31}`,
					},
				},
			},
			include: [
				{
					model: HairStyle,
					attributes: ["price"],
				},
			],
		});

		//map of month and price
		const finances = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
			10: 0,
			11: 0,
			12: 0,
		};
		const customers = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
			10: 0,
			11: 0,
			12: 0,
		};

		for (let i = 0; i < result.length; i++) {
			const info = result[i];
			const infoMonth = new Date(info.date).getMonth() + 1;
			const infoPrice = parseInt(info["HairStyle"].price);
			if (finances[infoMonth] !== undefined) {
				finances[infoMonth] = finances[infoMonth] + infoPrice;
				customers[infoMonth] = customers[infoMonth] + 1;
			} else {
				finances[infoMonth] = infoPrice;
				customers[infoMonth] = 1;
			}
		}

		const flattenedFinance = Object.entries(finances);
		const flattendedCustomers = Object.entries(customers);
		const months = {
			1: "Jan",
			2: "Feb",
			3: "Mar",
			4: "Apr",
			5: "May",
			6: "Jun",
			7: "Jul",
			8: "Aug",
			9: "Sept",
			10: "Oct",
			11: "Nov",
			12: "Dec",
		};

		const finalFinance = [];
		for (let i = 0; i < flattenedFinance.length; i++) {
			finalFinance.push({
				month: months[flattenedFinance[i][0]],
				amount: flattenedFinance[i][1],
			});
		}

		const finalCustomer = [];
		for (let i = 0; i < flattendedCustomers.length; i++) {
			finalCustomer.push({
				month: months[flattendedCustomers[i][0]],
				noOfCustomers: flattendedCustomers[i][1],
			});
		}

		res.json({
			finalFinance,
			finalCustomer,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

module.exports = { analyticsInfo };
