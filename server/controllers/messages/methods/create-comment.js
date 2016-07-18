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
            Message.findOne({_id: req.body._id}, function (err, message) {
                cb(err, user, message);
            });
        }

    }, function (user, message, cb) {

        if (message) {

            if (message.answers) {
                MessagesGroup.findOne({_id: message.answers }, function (err, msgGroup) {
                    cb(err, user, message, msgGroup);
                });
            } else {
                var newMsgGroup = new MessagesGroup({});
                newMsgGroup.save(function (err, savedMsgGroup) {

                    message.answers = savedMsgGroup._id;

                    message.save(function (err) {
                        cb(err, user, message, savedMsgGroup);
                    });
                });
            }
        } else {
            statusCode = 404;
            cb(true);
        }

    }, function (user, message, msgGroup, cb) {

        var newMsg = new Message({
            user: user._id,
            text: req.body.text
        });

        newMsg.save(function (err) {
            cb(err, user, message, msgGroup, newMsg);
        });

    }, function (user, message, msgGroup, newMsg, cb) {

        msgGroup.messages.push(newMsg._id);

        msgGroup.save(function (err) {
            cb(err);
        });
    }], function (err, result) {

        if (err) {
            res.status(statusCode).end();
        } else {
            res.send({ success: true });
        }
    });
};