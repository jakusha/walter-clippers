import Joi from "joi";

export const schema = Joi.object({
	date: Joi.date().iso().required().messages({
		"any.required": `date is a required field`,
	}),
	time: Joi.string()
		.regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
		.required(),
	hairStyleId: Joi.string().required().messages({
		"string.base": `hairStyleId should be a string`,
		"string.empty": `hairStyleId cannot be an empty`,
		"any.required": `hairStyleId is a required field`,
	}),
}).options({ abortEarly: true });
