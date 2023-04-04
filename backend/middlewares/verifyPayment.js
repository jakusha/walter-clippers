const axios = require("axios");
require("dotenv").config();

async function verifyPayment(req, res, next) {
	const value = req.body.payment;

	try {
		const result = await axios.get(
			`https://api.paystack.co/transaction/verify/${value.reference}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_TOKEN}`,
				},
			}
		);

		if (result.data.data.status === "success") {
			next();
		} else {
			return res.sendStatus(400);
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

module.exports = { verifyPayment };
