var config = require('./config');
var app = require('./lib/app');
var async = require('async');
var MessagesGroup = require('./models/messages-group');

_MAIN_GROUP_ID = config.get('database:main-group-id');

require('./routes')(app);

async.series([function (cb) {
    MessagesGroup.findOne({ _id: _MAIN_GROUP_ID }, function(err, data) {
        if (err) throw err;

        if (!data) {
            var mainMessageGroup = new MessageGroup({
                _id: _MAIN_GROUP_ID
            });

            mainMessageGroup.save(cb);
        } else {
            cb(null);
        }
    });
}], function (err) {
    if (err) throw err;

    app.listen(config.get('server:port'), function() {
        console.log('Server is listerning on port ' + config.get('server:port'));
    });
});