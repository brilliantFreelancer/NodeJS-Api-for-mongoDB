const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sbuSchema = new Schema({
    SBUName: {type: String, require: true},
    IBFId: {type: String, require: true},
}, {timestamps: true});


module.exports = mongoose.model('sbu', sbuSchema);