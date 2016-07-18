myApp.directive('auth', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
    return {
        restrict: 'AE',
        templateUrl: '/templates/include/auth.html',
        link: function ($scope, $elm, $attrs) {
            $scope.centered = $attrs['center'];

            $scope.logout = function () {
                $http.get('/api/logout').then(function(result) {
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