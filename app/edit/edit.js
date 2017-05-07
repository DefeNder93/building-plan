app.controller('edit', function($scope, Api) {
    $scope.state = {
        edit: false
    };
    $scope.editImageApi = {};
    $scope.save = function() {
        $scope.editImageApi.save();
    };
    $scope.saveTransformed = function() {
        console.log('saveTransformed');
    };
});
