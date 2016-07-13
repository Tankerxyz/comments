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

var User = require('./models/user');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook');


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

app.get('/auth/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
        clientID: config.get('auth:facebook:app_id'),
        clientSecret: config.get('auth:facebook:app_secret'),
        callbackURL: "http://localhost:"+config.get('server:port')+"/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {

        console.log('localStrategy:',profile);

        User.findOne({user_id: profile.id}, {_id: 0}, function (err, user) {

            if (err) {
                throw err;
            }

            if (!user) {
                var newUser = new User({
                    username: profile.displayName,
                    user_id: profile.id,
                    avatar_path: profile.photos[0].value
                });

                newUser.save(function(err, data) {
                    if (err) {
                        return cb(err);
                    }

                    if (data) {
                        return cb(null, user);
                    } else {
                        return cb(true);
                    }
                });
            } else {
                console.log('userIsArrived', user);
                return cb(null, user);
            }

        });
    }
));

passport.serializeUser(function(user, done) {

    console.log('serializeUser: ', user);

    done(null, user.user_id);
});

passport.deserializeUser(function(userId, done) {
    console.log('deserialize', userId);
    User.findOne({ user_id: userId }, {_id: 0, __v: 0}, function(err, user) {

        console.log('res from deserialize:',user);

        done(err, user);
    });
});

app.get('/api/auth', function (req, res) {
    console.log(Object.keys(req));
    // console.log(req._passport);
    res.send(req.user);
});

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {

        req.user = 'hui';

        console.log('/callback');

        // Successful authentication, redirect home.
        res.redirect('/comments');
    });


app.get('/auth/facebook', passport.authenticate('facebook'));


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