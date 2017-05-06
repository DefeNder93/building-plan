app.service("Api", function($http) {
    var API_PATH = 'http://localhost:3000';
    this.getBuildings = function() {
        return $http.get(API_PATH + '/buildings');
    };
});
