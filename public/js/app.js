var myApp = angular.module('myApp', ["ngRoute", "door3.css"]);

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
    .run(['$rootScope', '$http', function($rootScope, $http) {

        $http.get('/api/auth').then(function(result) {

            console.log(result);
            $rootScope.user = result.data || undefined;
        });
    }]);