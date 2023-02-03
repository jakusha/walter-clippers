const Joi = require("joi");

module.exports = Joi.object({
	name: Joi.string().alphanum().required().messages({
		"string.base": `name should be a string`,
		"string.empty": `name cannot be an empty`,
		"any.required": `name is a required field`,
	}),
	price: Joi.number().required().messages({
		"number.base": `price should be a number`,
		"number.empty": `email cannot be an empty`,
		"any.required": `email is a required field`,
	}),
}).options({ abortEarly: false });
