var passport = require('passport');
var config = require('../../config');
var FacebookStrategy = require('passport-facebook');

var User = require('../../models/user');


passport.use(new FacebookStrategy({
        clientID: config.get('auth:facebook:app_id'),
        clientSecret: config.get('auth:facebook:app_secret'),
        callbackURL: "http://localhost:"+config.get('server:port')+"/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {

        console.log('FacebookStrategy:',profile);

        User.findOne({user_id: profile.id}, {_id: 0}, function (err, user) {

            if (err) {
                throw err;
            }

            if (!user) {
                var newUser = new User({
                    username: profile.displayName,
                    user_id: profile.id,
                    account_path: "http://facebook.com/"+profile.id,
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
                return cb(null, user);
            }

        });
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