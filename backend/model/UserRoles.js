const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserRoles = sequelize.define(
	"UserRoles",
	{
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Roles",
				key: "roleId",
			},
		},
		custId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Customer",
				key: "custId",
			},
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = UserRoles;
