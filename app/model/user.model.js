const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let userSchema = new Schema({
    Username: {type: String, require: true, unique: true},
    Email: {type: String},
    LastName: {type: String},
    FirstName: {type: String},
    Password: {type: String, require: true, select: false},
    IsActive: Boolean,
}, {timestamps: true});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    mongoose.model('user', userSchema).findById(this.id).select('+Password').exec((err, item) => {
        if (!err) {
            if(candidatePassword === item.Password){
                cb(err, true);
            }else {
                cb(err, false);
            }

            /**
             * Todo: Use hash function for Password
             *
             */

            // bcrypt.compare(candidatePassword, item.Password, (err, isMatch) => {
            //     cb(err, isMatch);
            // });
        }
    });

};


module.exports = mongoose.model('user', userSchema);