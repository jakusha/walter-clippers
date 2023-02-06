const Joi = require("joi");
const { DateTime } = require("luxon");

module.exports = Joi.object({
	date: Joi.date().iso().required().messages({
		"any.required": `date is a required field`,
	}),
	time: Joi.string()
		.regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
		.required(),
	custId: Joi.string().required().messages({
		"string.base": `customer id should be a string`,
		"string.empty": `customer id cannot be an empty`,
		"any.required": `customer id is a required field`,
	}),
	hairStyleId: Joi.string().required().messages({
		"string.base": `hairStyleId should be a string`,
		"string.empty": `hairStyleId cannot be an empty`,
		"any.required": `hairStyleId is a required field`,
	}),
}).options({ abortEarly: false });
