const mongoose = require('mongoose');
const chalk = require('chalk');

const mongodbConfig = require('./config/mongoDB.config');

const bucketModel = require('./app/model/bucket.model')
const metricModel = require('./app/model/metric.model')
const projectModel = require('./app/model/project.model')
const projectperformanceModel = require('./app/model/projectperformance.model')


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

run();

function run() {
    projectModel.find({}, function (err, projects) {
        for (let i=0 ;i< projects.length;i++) {
            bucketModel.find({}, function (err, buckets) {
                for (let j=0 ;j< buckets.length;j++) {
                    metricModel.find({BucketId:buckets[j]._id}, function (err, metrics) {
                        for (let k=0 ;k< metrics.length;k++) {
                            newProjectPerformance(projects[i]._id,metrics[k]._id,0,function () {

                            })
                        }
                    })
                }
            })
        }
    })
}

function newProjectPerformance(ProjectId, MetricId, PerformanceValue) {
    let newProjectPerformance = new projectperformanceModel({
        ProjectId:ProjectId,
        MetricId:MetricId,
        PerformanceValue:PerformanceValue
    });
    newProjectPerformance.save(function (err, newDoc) {
        if (err) {
            console.log('%s Can not new ProjectPerformance to add!', chalk.red('✗'))
            throw err
        } else {
            console.log('%s New ProjectPerformance added: %s', chalk.green('✓'),PerformanceValue)
        }
    })
}