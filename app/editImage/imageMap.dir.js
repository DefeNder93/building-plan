app.directive('imageMap', function ($http, consts, Utils) {
    return {
        restrict: 'E',
        scope: {
            imageLink: '=',
            polygons: '=',
            setActivePolygon: '&',
            api: '='
        },
        link: function(scope, el, attrs) {
            var draw;

            scope.api.zoomIn = zoomIn;
            scope.api.zoomOut = zoomOut;
            scope.api.resetZoom = resetViewbox;

            scope.$watch('imageLink',function(link){
                if (link) {
                    $http.get(link).then(function(r){
                        createSvg(r.data);
                        initElements();
			draw.on('mousewheel', function(e) {
	    		     ptX = e.layerX;
			     ptY = e.layerY;
       	                     Utils.wheel(e, zoomIn, zoomOut);
		        });
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

            var zoomStep = consts.IMAGE_ZOOM_STEP || 20;
            function createSvg(data) {
                draw && (draw.remove());
                draw = SVG('image-map').size(1200, 500); //.draggable();
                draw.attr('class', 'scaling-svg');
                resetViewbox();
                draw.svg(data);
            }

            function resetViewbox() {
                draw.viewbox(0, 0, 1898.1851, 1601.6219);  // initial values
            }

            function zoomIn() {
                var box = draw.viewbox();
                draw.viewbox(box.x, box.y, box.width - zoomStep, box.height / box.width * (box.width - zoomStep))
            }

            function zoomOut() {
                var box = draw.viewbox();
                draw.viewbox(box.x, box.y, box.width + zoomStep, box.height / box.width * (box.width + zoomStep))
            }

            // drag-n-drop
            var mousedownCoords = {};
            angular.element(el).mousedown(function(e){
                mousedownCoords.x = e.offsetX;
                mousedownCoords.y = e.offsetY;
            });

            angular.element(el).mouseup(function(e){
                if (mousedownCoords.x && mousedownCoords.y) {
                    var xDifference =  e.offsetX-mousedownCoords.x;
                    var yDifference =  e.offsetY-mousedownCoords.y;
                    var viewbox = draw.viewbox();
                    draw.viewbox({ x: viewbox.x - xDifference, y: viewbox.y - yDifference, width: viewbox.width, height: viewbox.height })
                }
            });
        }
    };
});

