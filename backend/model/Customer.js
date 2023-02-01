const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define(
	"Customer",
	{
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		refreshToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		cust_id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Customer;
