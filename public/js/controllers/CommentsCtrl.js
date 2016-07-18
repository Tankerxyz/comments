myApp.controller('CommentsCtrl', ['$rootScope', '$scope', '$http', '$compile', '$sce', function($rootScope, $scope, $http, $compile, $sce) {

    $rootScope.title = 'Comments';
    $scope.inputText = '';

    var sendStates = {
        SEND: 0,
        REPLY: 1,
        EDIT: 2
    };

    $scope.sendStates = sendStates;

    $scope.sendState = sendStates.SEND;

    $scope.activeMessage;

    function answerCb (result) {
        $scope.inputText = '';
        $scope.sendState = $scope.sendStates.SEND;
        getAnswers();
        console.log(result);
    }

    function getAnswers() {
        $http.get('/api/get-main-group')
            .then(function (result) {
                    $scope.answers = angular.copy(result.data);
                    console.log(result.data);
                },
                function (err) {
                    console.error(err);
                });
    }
    getAnswers();

    $scope.send = function (messageText) {
        var text = messageText.slice(0, 1000);

        if (text) {
            switch ($scope.sendState) {
                case sendStates.SEND:
                    $http.put('/api/create-message', {text: text})
                        .then(answerCb);
                    break;
                case sendStates.REPLY:
                    $http.put('/api/create-comment', { _id: $scope.activeMessage._id, text: text })
                        .then(answerCb);
                    break;
                case sendStates.EDIT:
                    $http.post('/api/edit-comment', { _id: $scope.activeMessage._id, text: text })
                        .then(answerCb);
                    break;
                default:
                    throw "Bad sendState: '"+$scope.sendState+"'";
            }
        }
    };
    
    $scope.resetSendState = function () {
        $scope.inputText = '';
        $scope.activeMessage = null;
        $scope.sendState = sendStates.SEND;
    };

    $scope.removeMessage = function (message) {
        $http.delete('/api/remove-message'+message._id)
            .then(function(result) {
                console.log(result);
                getAnswers();
            },
            function (err) {
                console.error(err);
            })
    };

    $scope.setStateMessage = function (message, state) {
        
        $('#main-input').focus();
        
        $scope.sendState = state;
        switch (state) {
            case sendStates.SEND:
                $scope.inputText = '';
                break;
            case sendStates.REPLY:
                $scope.inputText = message.user.username+', ';
                break;
            case sendStates.EDIT:
                $scope.inputText = message.text;
                break;
            default:
                throw "Bad sendState: '"+state+"'";
        }
        $scope.activeMessage = message;
    };

}]);