app.controller("buildingInfo", function($scope, Api) {
    Api.getBuildings().then(function(r){
        console.log('Buildings');
        console.log(r.data);
    }).catch(function(){
        console.log('error');
    });
});
