var Message = require('../../../models/message');

module.exports = function (req, res, next) {

    Message.findOne({ _id: req.body._id }, function (err, msg) {
        if (err) throw err;
        
        if (!!msg) {
            msg.text = req.body.text;
            msg.save(function (err) {
                if (err) throw err;

                res.send({ success: true });
            });
        } else {
            res.status(401).end()
        }
    })
};