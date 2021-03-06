app.controller('login', function($scope, Api) {
    $scope.credentials = {};
    $scope.state = {
        success: false
    };
    $scope.login = function() {
        Api.login($scope.credentials).then(function(){
            $scope.state.success = true;
        }).catch(function(){
            console.log('Login server error');
        })
    }
});