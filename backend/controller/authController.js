const Customer = require("../model/Customer");
const loginUserSchema = require("../validationjoi/authentication/loginCustomer");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const UserRoles = require("../model/UserRoles");
require("dotenv").config();

async function handleLogin(req, res) {
	const { value, error } = loginUserSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.message });
	}

	const foundCustomer = await Customer.findOne({
		where: {
			username: value.username,
		},
	});

	if (!foundCustomer) return res.sendStatus(409);
	//verify password
	const match = await bcrypt.compare(value.password, foundCustomer.password);
	if (match) {
		//get user roles
		const userRoles = await UserRoles.findAll({
			where: {
				custId: foundCustomer.custId,
			},
		});

		//sign jwt tokn
		const rolesResult = userRoles.map((customer) => customer.roleId);

		// console.log(rolesResult, "USERS ROLES");
		const accessToken = jwt.sign(
			{
				username: foundCustomer.username,
				roles: rolesResult,
				email: foundCustomer.email,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "3h" }
		);

		// console.log(accessToken, "ACCCESSS TOKKKEENN !!!!!!!!!!!!!!!11");
		const refreshToken = jwt.sign(
			{
				username: foundCustomer.username,
				roles: rolesResult,
				email: foundCustomer.email,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "7d" }
		);

		//save refresh token in dateabse
		foundCustomer.refreshToken = refreshToken;
		foundCustomer.save();

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		const { username, email, custId } = foundCustomer;
		const customer = { username, email, custId };
		res.json({
			message: "logged in succesfully",
			accessToken,
			customer,
		});
	} else {
		res.status(401).json({ message: "incorrect password" });
	}
}

async function handleLogout(req, res) {
	const cookies = req.cookies;

	//check if the client had a cookie
	if (!cookies?.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	//check if the refresh token ecist in our database
	const customer = await Customer.findOne({
		where: {
			refreshToken: refreshToken,
		},
	});

	if (customer) {
		customer.refreshToken = null;
		customer.save();
	}

	res.clearCookie("jwt", { httpOnly: true, sameSite: "none" }); //in production add the option secure:true
	return res.json(customer).status(204);
}

async function handleRefreshToken(req, res) {
	// console.log(req, "REQUeKSDF!!!!!!!!!");
	const cookies = req.cookies;

	// console.log(cookies, "COOKIIEESSSS!!!!!!");
	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	//check if the refresh token exist in our database
	const foundCustomer = await Customer.findOne({
		where: {
			refreshToken: refreshToken,
		},
	});

	if (!foundCustomer) return res.sendStatus(403);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err || foundCustomer.username !== decoded.username)
				return res.sendStatus(403);
			const userRoles = await UserRoles.findAll({
				where: {
					custId: foundCustomer.custId,
				},
			});

			const rolesResult = userRoles.map((customer) => customer.roleId);

			const accessToken = jwt.sign(
				{
					username: foundCustomer.username,
					email: foundCustomer.email,
					roles: rolesResult,
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "1d" }
			);
			const { username, email, custId } = foundCustomer;
			const customer = { username, email, custId };
			res.json({ accessToken, customer });
		}
	);
}

module.exports = { handleLogin, handleLogout, handleRefreshToken };
