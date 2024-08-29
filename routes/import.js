const express = require('express');
const router = express.Router();
const {newConnection, newDataModel} = require('../models');



router.post('/import', async (req, res) => {
	const connection = await newConnection();
	const dataModel = await newDataModel(connection);
	const {location, message} = req.body;
	
	await dataModel.create({
		location,
		message
	}).then(() => {
		res.status(200).send('Data imported');
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Error importing data:', err);
	});

	connection.close();
});

module.exports = router;