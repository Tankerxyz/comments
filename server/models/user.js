var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    account_path: {
        type: String,
        required: true
    },
    avatar_path: {type: String},
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);