const {Sequelize, DataTypes} = require('sequelize');
require('pg');
require('dotenv').config();

const newConnection = async () => {
	const pgstring = process.env.DATABASE_URL
	const connection = await new Sequelize(pgstring, {
		logging: false,
	})

	try {
		await connection.authenticate();
		console.log('Connection established');
	} catch (error) {
		console.log(error);
		return null;
	}

	return connection;
}

const newDataModel = async (connection) => {

	const model = await connection.define('mailbox', {
		location: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		message: {
			type: DataTypes.STRING,
		}
	},{
		timestamps: false,
		freezeTableName: true
	})

	try {
		await model.sync();
		console.log('Model synced');
	} catch (error) {
		console.log(error);
		return null;
	}

	return model;
}


module.exports = { newConnection, newDataModel };