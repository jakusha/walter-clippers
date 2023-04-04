const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Appointment = require("./Appointment");

const Transactions = sequelize.define(
	"Transactions",
	{
		appointmentId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Appointment",
				key: "appointmentId",
			},
		},
		transactionId: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
	},
	{
		freezeTableName: true,
	}
);

Transactions.hasOne(Appointment, {
	foreignKey: "appointmentId",
});
module.exports = Transactions;
