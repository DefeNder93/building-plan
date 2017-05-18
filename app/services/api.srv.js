app.service("Api", function($http) {
    var API_PATH = 'localhost:3000';
    this.getBuildings = function() {
        return $http.get(API_PATH + '/buildings');
    };
    this.setBuildings = function(building) {
        return $http.put(API_PATH + '/buildings/'+building.id, building);
    };
    this.login = function(credentials) {
        return $http.post(API_PATH + '/login', credentials);
    };
});
