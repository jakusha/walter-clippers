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
		return res.json({ message: error.message }).status(400);
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

		const rolesResult = userRoles.map((customer) => customer.roleId);

		//sign jwt tokn
		const accessToken = jwt.sign(
			{
				username: foundCustomer.username,
				roles: rolesResult,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "5m" }
		);

		console.log(accessToken, "ACCCESSS TOKKKEENN !!!!!!!!!!!!!!!11");
		const refreshToken = jwt.sign(
			{
				username: foundCustomer.username,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		//save refresh token in dateabse
		foundCustomer.refreshToken = refreshToken;
		foundCustomer.save();

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: "None",
			maxAge: 300000,
			sevure: true,
		});
		return res.json({ message: "logged in succesfully", accessToken });
	} else {
		return res.status(401).json({ message: "incorrect password" });
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

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); //in production add the option secure:true
	return res.json(customer).status(204);
}

async function handleRefreshToken(req, res) {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	//check if the refresh token exist in our database
	const customer = await Customer.findOne({
		where: {
			refreshToken: refreshToken,
		},
	});

	if (!customer) return res.sendStatus(403);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err || customer.username !== decoded.username)
				return res.sendStatus(403);
			const userRoles = await UserRoles.findAll({
				where: {
					custId: customer.custId,
				},
			});

			const rolesResult = userRoles.map((customer) => customer.roleId);

			const accessToken = jwt.sign(
				{
					username: customer.username,
					roles: rolesResult,
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "5m" }
			);

			res.json({ accessToken });
		}
	);
}

module.exports = { handleLogin, handleLogout, handleRefreshToken };
