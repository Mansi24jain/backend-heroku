const Sequelize = require('sequelize');
const db = require('../database/dbr');

module.exports = db.sequelize.define(
	'report',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		iv: {
			type: Sequelize.STRING,
		},
		// video: {
		// 	type: Sequelize.STRING,
		// },
		location: {
			type: Sequelize.STRING,
		},
		description: {
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
