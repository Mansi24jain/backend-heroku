const Sequelize = require('sequelize');
const dbr = {};
const sequelize = new Sequelize('backend', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	operatorAlianses: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

dbr.sequelize = sequelize;
dbr.Sequelize = Sequelize;

module.exports = dbr;
