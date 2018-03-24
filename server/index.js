var config = require('./config');
var app = require('./lib/app');
var async = require('async');
var MessagesGroup = require('./models/messages-group');
var PORT = process.env.PORT || '3030';

_MAIN_GROUP_ID = config.get('database:main-group-id');

require('./routes')(app);

async.series([function (cb) {
    MessagesGroup.findOne({ _id: _MAIN_GROUP_ID }, function(err, data) {
        if (err) throw err;

        if (!data) {
            var mainMessageGroup = new MessagesGroup({
                _id: _MAIN_GROUP_ID
            });

            mainMessageGroup.save(cb);
        } else {
            cb(null);
        }
    });
}], function (err) {
    if (err) throw err;

    app.listen(PORT, function() {
        console.log('Server is listerning on port ' + PORT);
    });
});