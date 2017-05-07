var app = angular.module('buildingPlan', [
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap',
    'ui.router'
]);

app.config(function($stateProvider) {
    $stateProvider.state({
        name: 'buildingInfo',
        url: '/building-info',
        controller: 'buildingInfo',
        templateUrl: 'app/buildingInfo/buildingInfo.html'
    }).state({
        name: 'login',
        url: '/login',
        templateUrl: 'app/login/login.html'
    });
});
