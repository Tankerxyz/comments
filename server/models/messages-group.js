var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var MessagesGroupSchema = new Schema({
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message'}]
});

MessagesGroupSchema.plugin(deepPopulate,{});

module.exports = mongoose.model('MessagesGroup', MessagesGroupSchema);