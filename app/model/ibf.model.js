const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ibfSchema = new Schema({
    IBFName: {type: String, require: true},
    Description: {type: String},
}, {timestamps: true});


module.exports = mongoose.model('ibf', ibfSchema);