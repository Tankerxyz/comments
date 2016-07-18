myApp.directive('auth', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
    return {
        restrict: 'AE',
        templateUrl: '/templates/include/auth.html',
        link: function ($scope, $elm, $attr) {

            $scope.logout = function () {
                $http.get('/api/logout').then(function(result) {
                    console.log(result);
                    $location.path('/');
                    $rootScope.user = undefined;
                },function (err) {
                    console.error(err);
                });
            };

            $scope.authOnFacebook = function () {
                window.location.pathname = 'api/auth/facebook';
            }
        }
    };
}]);