const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bucketSchema = new Schema({
    BucketName: {type: String, require: true}
}, {timestamps: true});


module.exports = mongoose.model('bucket', bucketSchema);