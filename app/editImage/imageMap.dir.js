app.directive('imageMap', function ($http) {
    return {
        restrict: 'E',
        scope: {
            imageLink: '='
        },
        link: function(scope, el, attrs) {
            var draw;

            scope.$watch('imageLink',function(link){
                if (link) {
                    $http.get(link).then(function(r){
                        createSvg(r.data);
                    });
                }
            });

            function createSvg(data) {
                draw && (draw.remove());
                draw = SVG('image-map').size(1200, 500);
                draw.attr('class', 'scaling-svg');
                draw.attr('viewBox', '0 0 1898.1851 1601.6219');
                draw.svg(data);
            }
        }
    };
});

