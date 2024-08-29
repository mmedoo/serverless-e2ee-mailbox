const express = require('express');
const router = express.Router();
const {newConnection, newDataModel} = require('../models');
require('pg');

router.post('/export', async (req, res) => {
	const connection = await newConnection();
	const dataModel = await newDataModel(connection);
	
	const {loc} = req.body;
	
	const object = await dataModel.findOne({
		attributes: ['message'],
		where: { location: loc }
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Error Exporting mail');
	});
	
	res.send(object.message);

	connection.close();
});

module.exports = router;