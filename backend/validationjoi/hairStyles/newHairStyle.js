const Joi = require("joi");

module.exports = Joi.object({
	name: Joi.string().required().messages({
		"string.base": `name should be a string`,
		"string.empty": `name cannot be an empty`,
		"any.required": `name is a required field`,
	}),
	price: Joi.number().required().messages({
		"number.base": `price should be a number`,
		"number.empty": `price cannot be an empty`,
		"any.required": `price is a required field`,
	}),
}).options({ abortEarly: false });
