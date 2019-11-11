const fs = require('fs');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const chalk = require('chalk');

const mongodbConfig = require('./config/mongoDB.config');

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

const metricModel = require('./app/model/metric.model')

LoadCSV()

function LoadCSV (){
    fs.createReadStream('New folder/CommandCentreData (2).csv')
        .pipe(csv.parse({ headers: true }))
        .pipe(csv.format({ headers: true }))
        .transform((row, next) => {
            newMetric(row.MetricName, row.UoM, row.BucketId, row.RedCriteriaSign, row.RedCriteriaValue, row.AmberCriteriaSign, row.AmberCriteriaValue, row.GreenCriteriaSign, row.GreenCriteriaValue, function () {
                next()
            })
        })
        .on('error', error => console.error(error))
        .on('data', row => {

            // console.log(row.MetricName, row.UoM, row.BucketId, row.RedCriteriaSign, row.RedCriteriaValue, row.AmberCriteriaSign, row.AmberCriteriaValue, row.GreenCriteriaSign, row.GreenCriteriaValue)

        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
}

function newMetric(MetricName, UoM, BucketId, RedCriteriaSign, RedCriteriaValue, AmberCriteriaSign, AmberCriteriaValue, GreenCriteriaSign, GreenCriteriaValue, callBack) {

    let newMetric = new metricModel({
        MetricName:MetricName,
        UoM:UoM,
        BucketId:BucketId,
        RedCriteriaSign:RedCriteriaSign,
        RedCriteriaValue:RedCriteriaValue,
        AmberCriteriaSign:AmberCriteriaSign,
        AmberCriteriaValue:AmberCriteriaValue,
        GreenCriteriaSign:GreenCriteriaSign,
        GreenCriteriaValue:GreenCriteriaValue
    });
    newMetric.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new Metric to add!', chalk.red('✗'))
            throw err
        } else {
            callBack(newDoc._id)
            console.log('%s New Metric added: %s', chalk.green('✓'),MetricName)
        }
    })
}