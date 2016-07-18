var passport = require('../../lib/passport');
var auth = require('../../controllers/auth');

module.exports = function(app) {
    app.get('/api/logout', auth.logout);
    app.get('/api/auth', auth.auth);


    app.get('/api/auth/facebook', passport.authenticate('facebook'));
    app.get('/api/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            res.redirect('/comments');
        });
};