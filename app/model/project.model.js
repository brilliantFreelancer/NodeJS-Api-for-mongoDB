const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let projectSchema = new Schema({
    ProjectName: {type: String, require: true},
    AccountId: {type: String, require: true},
}, {timestamps: true});


module.exports = mongoose.model('project', projectSchema);