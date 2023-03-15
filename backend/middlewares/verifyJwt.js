const jwt = require("jsonwebtoken");

function verifyJwt(req, res, next) {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403); //invalid token

		req.username = decoded.username;
		req.roles = decoded.roles;

		console.log(decoded.roles, "DECODED CUSTOMER ROLE!!!");
		if (decoded.roles.includes(4848)) {
			req.user = "admin";
		} else {
			req.user = "customer";
		}

		next();
	});
}

module.exports = { verifyJwt };
