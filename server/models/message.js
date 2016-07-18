var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;


var MessageSchema = new Schema({
    user: { type: String, required: true , ref: 'User'},
    text: {type: String, required: true },
    created: {type: Date, default: Date.now},
    answers: { type: Schema.Types.ObjectId, required: false, ref: 'MessagesGroup'}
});

module.exports = mongoose.model('Message', MessageSchema);