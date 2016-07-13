myApp.directive('auth', [ function () {
    return {
        restrict: 'AE',
        templateUrl: '/templates/include/auth.html',
        link: function ($scope, $elm, $attr) {
            console.log('lil');
        }
    };
}]);