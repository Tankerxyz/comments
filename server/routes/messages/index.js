var messages = require('../../controllers/messages');

module.exports = function(app) {
    app.get('/api/get-main-group', messages.getMainGroup);
    app.put('/api/create-message', messages.createMessage);
    app.put('/api/create-comment', messages.createComment);
    app.post('/api/edit-comment', messages.editComment);
    app.delete('/api/remove-message:id', messages.removeMessage);
};