myApp.directive('auth', ['$http', function ($http) {
    return {
        restrict: 'AE',
        templateUrl: '/templates/include/auth.html',
        link: function ($scope, $elm, $attr) {

            $scope.logout = function () {
                window.location.pathname = 'auth/logout'
            };

            $scope.authOnFacebook = function () {
                window.location.pathname = 'auth/facebook'
            }

        }
    };
}]);