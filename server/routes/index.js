var staticPath = require('path').join(__dirname, './../../public');

module.exports = function(app) {

    app.get('/*', function(req, res, next) {
        var curPath = req.path.split('/')[1];

        if (curPath == 'api') {
            next();
        } else if (curPath == 'favicon.ico') {
            res.sendfile(staticPath + '/vendor/favicon.ico');
        } else {
            res.sendfile(staticPath + '/index.html');
        }
    });

    require('./auth')(app);
    require('./messages')(app);
};