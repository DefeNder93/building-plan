app.controller('buildingInfo', function($scope, Building) {
    $scope.buildings = [];
    $scope.floors = [];
    $scope.active = {
        building: null,
        floor: null,
        polygon: null
    };
    $scope.state = {
        draw: false,
        editInfo: false,
        editRooms: false
    };
    Building.getBuildings().then(function(data){
        $scope.buildings = data;
        $scope.chooseBuilding($scope.buildings[0]);
    }).catch(function(){
        console.log('Get buildings server error');
    });
    $scope.chooseBuilding = function(building) {
        $scope.active.building = building;
        $scope.active.floor = building.floors[0];
        $scope.floors = building.floors;
        $scope.active.polygon = null;
    };
    $scope.chooseFloor = function(floor) {
        $scope.active.floor = floor;
        $scope.active.polygon = null;
    };
    $scope.savePolygons = function(polygons) {
        $scope.active.floor.polygons = polygons;
        $scope.saveBuildings();
    };
    $scope.initPolygonInfo = function(polygon) {
        if (!polygon.info) {
            polygon.info = {};
        }
    };
    $scope.saveBuildings = function() {
        Building.setBuildings(deleteSvgFigures($scope.buildings));
    };
    $scope.setActivePolygon = function(polygon) {
        $scope.resetPolygonInfo();
        $scope.active.polygon = polygon;
        $scope.state.editInfo = false;
        $scope.clearOldPolygonInfo();
        $scope.$digest();
    };
    $scope.deleteSelectedPolygon = function() {
        if (!$scope.active.floor || !$scope.active.floor.polygons || !$scope.active.polygon) {
            return;
        }
        $scope.active.polygon.figure.remove();
        $scope.active.floor.polygons.splice($scope.active.floor.polygons.indexOf($scope.active.polygon), 1);
        $scope.saveBuildings();
    };
    var oldPolygonInfo = null;
    $scope.rememberOldPolygonInfo = function() {
        if (!$scope.active.polygon) {
            return;
        }
        oldPolygonInfo = angular.copy($scope.active.polygon.info);
    };
    $scope.clearOldPolygonInfo = function() {
        oldPolygonInfo = null;
    };

    $scope.resetPolygonInfo = function() {
        if (oldPolygonInfo) {
            $scope.active.polygon.info = angular.copy(oldPolygonInfo);
        }
    };

    function deleteSvgFigures(buildings) {
        var buildingsCopy = angular.copy(buildings);
        buildingsCopy.forEach(function(building){
            building.floors.forEach(function(floor){
                floor.polygons && floor.polygons.forEach(function(polygon){
                    polygon.points.forEach(function(point){
                        point.figure = null;
                    });
                })
            });
        });
        return buildingsCopy;
    }

    $scope.api = {
        editImageApi: {}
    };
    $scope.save = function() {
        $scope.api.editImageApi.save();
    };

});