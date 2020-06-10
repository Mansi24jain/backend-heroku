const Sequelize = require('sequelize');
const db = require('../database/db');

module.exports = db.sequelize.define(
	'user',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: Sequelize.STRING,
		},
		gender: {
			type: Sequelize.STRING,
		},
		number: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING,
		},
		age: {
			type: Sequelize.STRING,
		},
		created: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		},
	},
	{
		timestamps: false,
	}
);
