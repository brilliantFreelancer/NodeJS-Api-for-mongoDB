const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let metricSchema = new Schema({
    MetricName:{type: String},
    UoM:{type: String},
    BucketId:{type: String},
    RedCriteriaSign:{type: String},
    RedCriteriaValue:{type: String},
    AmberCriteriaSign:{type: String},
    AmberCriteriaValue:{type: String},
    GreenCriteriaSign:{type: String},
    GreenCriteriaValue:{type: String}
}, {timestamps: true});


module.exports = mongoose.model('metric', metricSchema);