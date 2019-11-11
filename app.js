const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const chalk = require('chalk');
const expressValidator = require('express-validator');
const errorHandler = require('errorhandler');

const serverConfig = require('./config/server.config')
const mongodbConfig = require('./config/mongoDB.config');
const indexRouter = require('./app/routes/index');
const usersRouter = require('./app/routes/users');
const metricRouter = require('./app/routes/metric');
const projectRouter = require('./app/routes/project');

let app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());



/**
 * Error Handler.
 */
if (serverConfig.configs.nodeEnv === 'development') {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
}



/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(mongodbConfig.configs.uri,{ useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('%s ... app connected to MONGO DB ...', chalk.green('✓'));
});
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/metric', metricRouter);
app.use('/api/project', projectRouter);

module.exports = app;
