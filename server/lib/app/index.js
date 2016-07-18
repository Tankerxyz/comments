var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var mongoose = require('../mongoose');
var MongoStore = require('connect-mongo')(session);
var staticPath = require('path').join(__dirname, '../../../public');
var passport = require('../passport');
var config = require('../../config');

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

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(staticPath), function(req, res, next) {
    next();
});

module.exports = app;