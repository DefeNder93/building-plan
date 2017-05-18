app.service("Building", function(Api, localStorageService, $q) {
    var _this = this;
    this.buildings = null;  // local copy
    this.getBuildings = function() {
        Api.getBuildings().then(function(r){
            localStorageService.set('buildings', r.data);
//            _this.buildings = r.data;
        //    return r.data;
        });
	var buildings = localStorageService.get('buildings');
        if (buildings) {
            _this.buildings = buildings;
            return $q.resolve(buildings);
	    }        
    };
    this.setBuildings = function(building) {
    //    localStorageService.set('buildings', buildings);
    //    _this.buildings = buildings;
	Api.setBuildings(building);
    }
});
