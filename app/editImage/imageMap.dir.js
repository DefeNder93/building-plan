app.directive('imageMap', function ($http) {
    return {
        restrict: 'E',
        scope: {
            imageLink: '=',
            polygons: '=',
            setActivePolygon: '&'
        },
        link: function(scope, el, attrs) {
            var draw;

            scope.$watch('imageLink',function(link){
                if (link) {
                    $http.get(link).then(function(r){
                        createSvg(r.data);
                        initElements();
                    });
                }
            });

            function initElements() {
                if (!scope.polygons || !scope.polygons.length) {
                    return;  // there is no polygons to init
                }
                scope.polygons.forEach(function(polygon){
                    drawPolygon(polygon);
                    polygon.figure.mouseover(function(e){
                        var polygon = getPolygonByTargetNode(e.target);
                        if (!polygon.active) {
                            polygon.figure.fill('green');
                        }
                    });
                    polygon.figure.mouseout(function(e){
                        var polygon = getPolygonByTargetNode(e.target);
                        if (!polygon.active) {
                            polygon.figure.fill('#f06');
                        }
                    });
                    polygon.figure.click(function(e){
                        var polygon = getPolygonByTargetNode(e.target);
                        scope.setActivePolygon({polygon: polygon});
                        setActive(polygon);
                    });
                });
            }

            function setActive(polygon) {
                scope.polygons.forEach(function(el){
                    el.figure.fill('#f06');
                    el.active = false;
                });
                polygon.active = true;
                polygon.figure.fill('blue');
            }

            function getPolygonByTargetNode(target) {
                for (var i=0; i<scope.polygons.length; i++) {
                    if (scope.polygons[i].figure.node === target) {
                        return scope.polygons[i];
                    }
                }
                return null;
            }

            function drawPolygon(polygon) {
                var coords = [];
                polygon.points.forEach(function(point){
                    coords.push(point.x, point.y);
                });
                polygon.figure = draw.polygon(coords);
                polygon.figure.fill('#f06');
            }

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

