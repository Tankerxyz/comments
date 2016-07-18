var Message = require('../../../models/message');
var User = require('../../../models/user');
var MessagesGroup = require('../../../models/messages-group');
var async = require('async');

module.exports = function (req, res, next) {

    var statusCode = 500;

    async.waterfall([function (cb) {

        User.findOne({ user_id: req.user.user_id }, cb);

    }, function (user, cb) {

        if (!user) {
            statusCode = 401;
            cb(true);
        } else {
            MessagesGroup.findOne({ _id: _MAIN_GROUP_ID }, function (err, msgGroup) {
                cb(err, user, msgGroup);
            });
        }

    }, function (user, msgGroup, cb) {

        if (msgGroup) {
            cb(null, user, msgGroup);
        } else {
            statusCode(404);
            cb(true);
        }

    }, function (user, msgGroup, cb) {

        var newMessage = new Message({
            user: user._id,
            text: req.body.text
        });

        newMessage.save(function(err, savedMessage) {
            cb(err, msgGroup, savedMessage);
        });

    }, function (msgGroup, savedMessage, cb) {

        msgGroup.messages.push(savedMessage._id);
        msgGroup.save(cb);

    }], function (err, result) {

        if (err) {
            res.status(statusCode).end();
        } else {
            res.send({ success: true });
        }
    });
};