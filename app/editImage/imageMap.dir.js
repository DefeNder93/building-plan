app.directive('imageMap', function ($http) {
    return {
        restrict: 'E',
        link: function(scope, el, attrs) {
            var draw = SVG('image-map').size(1200, 500);
            draw.attr('class', 'scaling-svg');
            draw.attr('viewBox', '0 0 1898.1851 1601.6219');

            $http.get('img/floor1.svg').then(function(r){
                draw.svg(r.data);
            });
        }
    };
});

