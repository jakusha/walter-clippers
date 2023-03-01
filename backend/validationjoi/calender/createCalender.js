const Joi = require("joi");

module.exports = Joi.object({
	month: Joi.number().min(0).max(11).required().messages({
		"any.required": `month is a required field`,
		"number.min": "month should be able between 1-12",
		"number.max": "month should be able between 1-12",
	}),
	year: Joi.number().min(2023).max(2300).required().messages({
		"any.required": `year is a required field`,
		"number.min": "year should be able between 2023-2300",
		"number.max": "year should be able between 2023-2300",
	}),
}).options({ abortEarly: false });

// {
//     date: {
//         type: DataTypes.DATEONLY,
//         allowNull: false,
//         defaultValue: Date.now(),
//     },
//     time: {
//         type: DataTypes.TIME,
//         allowNull: false,
//     },
//     completed: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },
//     cancelled: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },

//     custId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         references: {
//             model: "Customer",
//             key: "custId",
//         },
//     },
// },
