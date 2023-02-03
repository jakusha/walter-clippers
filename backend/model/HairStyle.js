const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HairStyle = sequelize.define(
	"HairStyle",
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		price: {
			type: DataTypes.DECIMAL(12, 2),
			allowNull: false,
		},
		hairStyleId: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = HairStyle;
