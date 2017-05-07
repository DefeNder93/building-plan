app.controller("buildingInfo", function($scope, Api) {
    $scope.buildings = [];
    $scope.floors = [];
    $scope.active = {
        building: null,
        floor: null
    };
    $scope.state = {
        draw: false
    };
    Api.getBuildings().then(function(r){
        $scope.buildings = r.data;
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
    $scope.saveDraw = function() {
        console.log('$scope.saveDraw');
    };
});
