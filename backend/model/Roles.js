const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const Roles = sequelize.define(
	"Roles",
	{
		role: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Roles;
