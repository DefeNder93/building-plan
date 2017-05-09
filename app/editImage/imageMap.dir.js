app.directive('imageMap', function ($http, consts) {
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
                    polygon.active = false;
                    polygon.figure.mouseover(function(e){
                        var polygon = getPolygonByTargetNode(e.target);
                        if (!polygon.active) {
                            polygon.figure.fill(consts.POLYGON_HOVER_COLOR).opacity(consts.POLYGONS_OPACITY);
                        }
                    });
                    polygon.figure.mouseout(function(e){
                        var polygon = getPolygonByTargetNode(e.target);
                        if (!polygon.active) {
                            polygon.figure.fill(consts.POLYGON_COLOR).opacity(consts.POLYGONS_OPACITY);
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
                    el.figure.fill(consts.POLYGON_COLOR).opacity(consts.POLYGONS_OPACITY);
                    el.active = false;
                });
                polygon.active = true;
                polygon.figure.fill(consts.POLYGON_ACTIVE_COLOR).opacity(consts.POLYGONS_OPACITY);
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
                polygon.figure.fill(consts.POLYGON_COLOR).opacity(consts.POLYGONS_OPACITY);
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

