var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var async = require('async');

var http = require('http');
var util = require('util');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var config = require('./config');

var mongoose = require('./lib/mongoose');

var db = mongoose.connection;

var MongoStore = require('connect-mongo')(session);
var staticPath = path.join(__dirname, './../public');



var app = express();

app.use(session({
    secret: config.get('server:secret'),

    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '20mb'
}));
app.use(bodyParser.json({
    limit: '20mb'
}));


// app.use(passport.initialize());
// app.use(passport.session());



app.use(express.static(staticPath), function(req, res, next) {

    console.log(req.path);

    next();
});


app.get('/*', function(req, res, next) {

    var curPath = req.path.split('/');
    if (curPath[1] && curPath[1] == 'api') {
        next();
    } else {
        res.sendfile(staticPath + '/index.html');
    }
});


app.listen(config.get('server:port'), function() {
    console.log('Server is listerning on port ' + config.get('server:port'));
});