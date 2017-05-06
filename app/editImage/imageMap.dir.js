app.directive('imageMap', function () {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            angular.element('img').mapster( {
                fillColor: 'ff0000',
                stroke: true,
                singleSelect: true
            });
        }
    };
});

