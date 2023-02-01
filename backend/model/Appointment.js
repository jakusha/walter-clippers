const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Appointment = sequelize.define(
	"Appointment",
	{
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			defaultValue: Date.now(),
		},
		time: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		cancelled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		appointmnetId: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Appointment;
