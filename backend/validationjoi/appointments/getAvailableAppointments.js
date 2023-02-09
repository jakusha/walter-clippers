const Joi = require("joi");
const { DateTime } = require("luxon");

module.exports = Joi.object({
	date: Joi.date().iso().required().messages({
		"any.required": `date is a required field`,
	}),
}).options({ abortEarly: false });
