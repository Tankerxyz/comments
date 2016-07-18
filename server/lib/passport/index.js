var passport = require('passport');
var config = require('../../config');
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var VkontakteStrategy = require('passport-vkontakte').Strategy;

var User = require('../../models/user');

function authHandler(profile, cb) {
    User.findOne({user_id: profile.id}, {_id: 0}, function (err, user) {

        if (err) {
            throw err;
        }

        if (!user) {
            var newUser = new User({
                username: profile.username,
                user_id: profile.id,
                account_path: profile.accountPath,
                avatar_path: profile.avatarPath
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
            return cb(null, user);
        }

    });
}

passport.use(new FacebookStrategy({
        clientID: config.get('auth:facebook:app_id'),
        clientSecret: config.get('auth:facebook:app_secret'),
        callbackURL: "http://localhost:"+config.get('server:port')+"/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
        authHandler({
            username: profile.displayName,
            id: profile.id,
            accountPath: "http://facebook.com/"+profile.id,
            avatarPath: profile.photos[0].value
        }, cb);
    }
));

passport.use(new GoogleStrategy({
        clientID: config.get('auth:google-plus:app_id'),
        clientSecret: config.get('auth:google-plus:app_secret'),
        callbackURL: "http://localhost:"+config.get('server:port')+"/api/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        authHandler({
            username: profile.displayName,
            id: profile.id,
            accountPath: profile._json.url,
            avatarPath: profile.photos[0].value
        }, cb);
    }
));

passport.use(new VkontakteStrategy({
        clientID: config.get('auth:vkontakte:app_id'),
        clientSecret: config.get('auth:vkontakte:app_secret'),
        callbackURL: "http://localhost:"+config.get('server:port')+"/api/auth/vkontakte/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        authHandler({
            username: profile.displayName,
            id: profile.id,
            accountPath: profile.profileUrl,
            avatarPath: profile.photos[0].value
        }, cb);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(function(userId, done) {
    User.findOne({ user_id: userId }, {_id: 0, __v: 0}, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;