var mongoose = require('mongoose');
var config = require('../../config');

mongoose.connect(config.get('database:uri'));

module.exports = mongoose;