const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let projectPerformanceSchema = new Schema({
    ProjectId:{type: String},
    MetricId:{type: String},
    PerformanceValue:{type: String}
}, {timestamps: true});


module.exports = mongoose.model('projectPerformance', projectPerformanceSchema);