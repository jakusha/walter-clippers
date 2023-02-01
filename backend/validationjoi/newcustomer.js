const Joi = require("joi");

module.exports = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required().messages({
		"string.base": `username should be a string`,
		"string.empty": `username cannot be an empty`,
		"string.min": `username should have a minimum length of {#limit}`,
		"string.max": `username should have a maximum length of {#limit}`,
		"any.required": `username is a required field`,
	}),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net"] },
		})
		.required()
		.messages({
			"string.base": `email should be a string`,
			"string.empty": `email cannot be an empty`,
			"any.required": `email is a required field`,
		}),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
		.required()
		.messages({
			"any.required": "password is a required field",
		}),
}).options({ abortEarly: false });
