var MessagesGroup = require('../../../models/messages-group');
var async = require('async');

var ObjectId = require('../../../lib/mongoose').Types.ObjectId;

var util = require('util');

var _ = require('lodash');


module.exports = function (req, res, next) {
    
    async.waterfall([function (cb) {
        MessagesGroup.find()
            .populate({
                path:'messages',
                options: {
                    sort: {
                        created: -1
                    }
                },
                populate: {
                    path:'user',
                    select: 'username user_id avatar_path account_path -_id'
                }
            })
            .exec(function (err, data) {

                cb(err, data);
            });

    }, function (data, cb) {

        // handle populate
        _.forEach(data, function (messageGroup) {
            _.forEach(messageGroup.messages, function (message) {
                if (message.answers && !message.answers._id) {
                    message.answers = _.find(data, { _id: message.answers });
                }
            });
        });

        cb(null, data)

    }], function (err, result) {
        if (err) throw err;
        
        res.send(_.find(result, {_id: ObjectId(_MAIN_GROUP_ID)}));
    });
};