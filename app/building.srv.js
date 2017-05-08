app.service("Building", function(Api, localStorageService, $q) {
    var _this = this;
    this.buildings = null;  // local copy
    this.getBuildings = function() {
        var buildings = localStorageService.get('buildings');
        if (buildings) {
            _this.buildings = buildings;
            return $q.resolve(buildings);
        }
        return Api.getBuildings().then(function(r){
            localStorageService.set('buildings', r.data);
            _this.buildings = r.data;
            return r.data;
        });
    };
    this.setBuildings = function(buildings) {
        localStorageService.set('buildings', buildings);
        _this.buildings = buildings;
    }
});
