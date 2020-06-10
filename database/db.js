const Sequelize = require('sequelize');
const db = {};
const sequelize = new Sequelize('nodejs_login1', 'root', '', {
	socketPath: '/cloudsql/backend-279606:us-east1:backend-69',
	host: '34.75.115.3',
	user: 'backend-69',
	password: 'backend-69',
	database: 'users',
	dialect: 'mysql',
	operatorAlianses: false,

	pool: {
		max: 7,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
