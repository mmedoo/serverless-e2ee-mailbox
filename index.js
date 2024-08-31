const express = require('express');
const importRouter = require('./routes/import');
const exportRouter = require('./routes/export');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'public/build')));

app.use(express.json());
 
// app.use(cors());

app.use('/', importRouter);
app.use('/', exportRouter);

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});

module.exports = app;