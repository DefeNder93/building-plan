app.controller("buildingInfo", function($scope, Building) {
    $scope.buildings = [];
    $scope.floors = [];
    $scope.active = {
        building: null,
        floor: null,
        polygon: null
    };
    $scope.state = {
        draw: false,
        editInfo: false
    };
    Building.getBuildings().then(function(data){
        $scope.buildings = data;
        $scope.chooseBuilding($scope.buildings[0]);
    }).catch(function(){
        console.log('error');
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
        // TODO delete svg object
        $scope.saveBuildings();
    };
    $scope.initPolygonInfo = function(polygon) {
        if (!polygon.info) {
            polygon.info = {};
        }
    };
    $scope.saveBuildings = function() {
        Building.setBuildings(deleteFigures($scope.buildings));
    };
    $scope.createPolygon = function(polygon) {
        // TODO
    };
    $scope.setActivePolygon = function(polygon) {
        $scope.active.polygon = polygon;
        $scope.$digest();
    };

    function deleteFigures(buildings) {
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
});