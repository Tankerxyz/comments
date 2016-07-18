var Message = require('../../../models/message');

module.exports = function (req, res, next) {

    Message.remove({ _id: req.params.id }, function (err) {
        if (err) throw err;

        res.send({ success: true });
    })
};