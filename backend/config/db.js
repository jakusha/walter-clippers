const { Sequelize } = require("sequelize");
require("dotenv").config();

// const dbConfig = {
// 	HOST: "localhost",
// 	USER: "postgres",
// 	PASSWORD: "password",
// 	DB: "postgres",
// 	dialect: "postgres",
// 	dialectOptions: {
// 		ssl: true,
// 	},
// };

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
// 	host: dbConfig.HOST,
// 	dialect: dbConfig.dialect,
// 	operatorsAliases: false,
// });

const sequelize = new Sequelize(process.env.DATABASE_URI, {
	dialect: "postgres",
	protocol: "postgres",
	port: 5432,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	dialectOptions: {
		ssl: true,
	},
});
module.exports = sequelize;
