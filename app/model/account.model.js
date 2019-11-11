const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let accountSchema = new Schema({
    AccountName: {type: String, require: true},
    SBUId: {type: String, require: true},
}, {timestamps: true});


module.exports = mongoose.model('account', accountSchema);