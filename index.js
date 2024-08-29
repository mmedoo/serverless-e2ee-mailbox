const express = require('express');
const importRouter = require('./routes/import');
const exportRouter = require('./routes/export');
const app = express();



app.use(express.static('public'));

app.use(express.json());

app.use('/', importRouter);
app.use('/', exportRouter);

app.listen(8080, () => {
	console.log('Server started');
});

module.exports = app;