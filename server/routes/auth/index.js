var passport = require('../../lib/passport');
var auth = require('../../controllers/auth');

module.exports = function(app) {
    app.get('/api/logout', auth.logout);
    app.get('/api/auth', auth.auth);

    app.get('/api/auth/vkontakte', passport.authenticate('vkontakte'));
    app.get('/api/auth/vkontakte/callback',
        passport.authenticate('vkontakte', { successRedirect: '/comments', failureRedirect: '/' }));

    app.get('/api/auth/google', passport.authenticate('google', { scope : ['profile'] }));
    app.get('/api/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/comments', failureRedirect: '/' }));

    app.get('/api/auth/facebook', passport.authenticate('facebook'));
    app.get('/api/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/comments', failureRedirect: '/' }));
};