const express = require('express');
const importRouter = require('./routes/import');
const exportRouter = require('./routes/export');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public/build')));

app.use(express.json());

app.use('/', importRouter);
app.use('/', exportRouter);

app.listen(8080);

module.exports = app;