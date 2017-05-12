app.service("Api", function($http) {
    var API_PATH = 'http://mit-vs-t4.main.vsu.ru:3000';
    this.getBuildings = function() {
        return $http.get(API_PATH + '/buildings');
    };
    this.login = function(credentials) {
        return $http.post(API_PATH + '/login', credentials);
    };
});
