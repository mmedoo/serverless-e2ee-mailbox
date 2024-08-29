const express = require('express');
const router = express.Router();
const {newConnection, newDataModel} = require('../models');
require('pg');

router.post('/export', async (req, res) => {
	const connection = await newConnection();
	const dataModel = await newDataModel(connection);
	
	const {location} = req.body;
	
	const object = await dataModel.findOne({
		attributes: ['message'],
		where: { location }
	});

	object ? res.send(object.message) : res.status(404).send('No mail found');
	
	connection.close();
});

module.exports = router;