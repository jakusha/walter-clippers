const Customer = require("../model/Customer");
const bcrypt = require("bcrypt");
const createUserSchema = require("../validationjoi/customers/newcustomer");
const updateCustomer = require("../validationjoi/customers/updateCustomer");
const { Op } = require("sequelize");
async function handleGetAllCustomers(req, res) {
	const customers = await Customer.findAll();
	res.json({ message: "success", customers });
}

async function handleCreateCustomer(req, res) {
	const { value, error } = createUserSchema.validate(req.body);
	if (error) {
		return res.json({ message: error.message }).status(400);
	}

	console.log(req.body);

	//check if customer with that usernamealready exist
	const foundCustomer = await Customer.findOne({
		where: {
			username: [value.username],
		},
	});

	console.log(foundCustomer);

	if (foundCustomer)
		return res.json({ message: "username is already in use" }).status(400);

	//hashing the password and creating customer
	try {
		//encrypt password
		const hashedPwd = await bcrypt.hash(value.password, 10);

		//create and store the new user
		//creating a new record
		const newcustomer = await Customer.create({
			...value,
			password: hashedPwd,
		});
		console.log(newcustomer);

		return res.json({
			message: "successfully created account",
			newcustomer,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function handleUpdateCustomer(req, res) {
	const custId = req.params.custId;

	const { value, error } = updateCustomer.validate(req.body);

	if (error) {
		return res.json({ message: error.message }).status(400);
	}

	try {
		//check valid appointment id
		const result = await Customer.findByPk(custId);
		if (result) {
			console.log(value, "asdadadasd=======11111110000000000");

			//check if username and email is available
			const foundUserInfo = await Customer.findOne({
				where: {
					[Op.or]: [
						{ username: value.username },
						{ email: value.email },
					],
				},
			});

			console.log(foundUserInfo);

			if (foundUserInfo)
				return res
					.json({ message: "username or email is not available" })
					.status(400);

			await Customer.update(
				{
					...value,
				},
				{
					where: {
						custId: custId,
					},
				}
			);
			return res.json({
				message: "customer successfully updated",
			});
		} else {
			return res.json({ message: "invalid customer id" }).status(400);
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}
}

async function handleDeleteCustomer(req, res) {
	const custId = req.params.custId;

	try {
		const result = await Customer.findByPk(custId);

		console.log(result);
		if (result) {
			await Customer.destroy({
				where: {
					custId: custId,
				},
			});
			return res.json({ message: "Customer deleted successfull" });
		} else {
			return res
				.status(400)
				.json({ message: `Customer ID ${custId} not found` });
		}
	} catch (error) {
		return res.json({ error: error.message }).status(500);
	}
}
module.exports = {
	handleGetAllCustomers,
	handleCreateCustomer,
	handleUpdateCustomer,
	handleDeleteCustomer,
};
