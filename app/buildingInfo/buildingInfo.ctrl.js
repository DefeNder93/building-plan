app.controller("buildingInfo", function($scope, Building) {
    $scope.buildings = [];
    $scope.floors = [];
    $scope.active = {
        building: null,
        floor: null
    };
    $scope.state = {
        draw: false
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
    };
    $scope.chooseFloor = function(floor) {
        $scope.active.floor = floor;
    };
    $scope.savePolygons = function(polygons) {
        $scope.active.floor.polygons = polygons;
    };
});
