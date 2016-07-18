var myApp = angular.module('myApp', ["ngRoute", "door3.css", "ngSanitize"]);

console.log(myApp);

myApp.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/main-page.html',
                controller: 'MainPageCtrl',
                css: 'css/main-page.css'
            })
            .when('/comments', {
                templateUrl: 'templates/comments.html',
                controller: 'CommentsCtrl',
                css: 'css/comments.css'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
    })
    .run(['$rootScope', '$http', '$location', function($rootScope, $http, $location) {

        $http.get('/api/auth').then(function(result) {
            console.log('api/auth: ', result.data);
            $rootScope.user = result.data || undefined;

            if ($rootScope.user) {
                $location.path('/comments');
            }
        });
    }]);