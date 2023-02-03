const Customer = require("../model/Customer");
const bcrypt = require("bcrypt");
const createUserSchema = require("../validationjoi/newcustomer");

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
module.exports = { handleGetAllCustomers, handleCreateCustomer };
