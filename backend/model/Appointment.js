const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const HairStyle = require("./HairStyle");

const Appointment = sequelize.define(
	"Appointment",
	{
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
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
		appointmentId: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		custId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Customer",
				key: "custId",
			},
		},
		hairStyleId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "HairStyle",
				key: "hairStyleId",
			},
		},
	},
	{
		freezeTableName: true,
	}
);

HairStyle.hasOne(Appointment, {
	foreignKey: "hairStyleId",
});
Appointment.belongsTo(HairStyle, {
	foreignKey: "hairStyleId",
});

module.exports = Appointment;
