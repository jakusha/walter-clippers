function verifyRoles(roles) {
	return (req, res, next) => {
		if (!req.username)
			return res.status(401).json({ message: "Unauthorized" });

		for (let i = 0; i < req.roles.length; i++) {
			const element = req.roles[i];

			if (roles.indexOf(element) === -1) {
				return res.status(403).json({ message: "Forbidden" });
			} else {
				continue;
			}
		}

		next();
	};
}
module.exports = { verifyRoles };
