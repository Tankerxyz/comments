myApp.controller('CommentsCtrl', ['$scope', '$http', '$compile', '$sce', function($scope, $http, $compile, $sce) {

    $scope.inputText = '';

    var sendStates = {
        SEND: 0,
        REPLY: 1,
        EDIT: 2
    };

    $scope.sendStates = sendStates;

    $scope.sendState = sendStates.SEND;

    $scope.activeMessage;

    function getAnswers() {
        $http.get('/api/get-main-group')
            .then(function (result) {
                    $scope.answers = result.data;
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
                        .then(function (result) {
                            $scope.inputText = '';
                            getAnswers();
                            console.log(result);
                        },
                        function (err) {
                            console.error(err);
                        });
                    break;
                case sendStates.REPLY:
                    $http.put('/api/create-comment', { _id: $scope.activeMessage._id, text: text })
                        .then(function (res) {
                            $scope.inputText = '';
                            getAnswers();
                            console.log(res);
                        },
                        function (err) {
                            console.error(err);
                        });
                    break;
                case sendStates.EDIT:
                    $http.post('/api/edit-comment', { _id: $scope.activeMessage._id, text: text })
                        .then(function (res) {
                            $scope.inputText = '';
                            getAnswers();
                            console.log(res);
                        },
                        function (err) {
                            console.error(err);
                        });
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