app.directive('editImage', function ($http, consts, $timeout) {
    return {
        restrict: 'E',
        scope: {
            editable: '<',
            rectMode: '<',
            polygons: '<',
            api: '=',
            imageLink: '=',
            save: '&'
        },
        link: function(scope, el, attrs) {
            $timeout(function(){
                scope.api = {
                    clear: clear,
                    save: createPolygon
                };
            });

            var points = [],
                polygons = [];
            
            function clear() {
                points.forEach(function(point){
                    point.figure.remove();
                });
                points = [];
            }

            function createPolygonObj() {
                return {
                    points: [],
                    figure: null
                };
            }

            function createPolygon() {
                var polygon = createPolygonObj();
                var coords = [];
                points.forEach(function(point){
                    coords.push(point.x, point.y);
                });
                polygon.figure = draw.polygon(coords);
                points.forEach(function(point){
                    point.figure.node.parentElement.appendChild(point.figure.node);
                });
                polygon.figure.fill(consts.POLYGON_COLOR).opacity(consts.POLYGONS_OPACITY);
                polygon.points = [].concat(points);
                polygons.push(polygon);
                points = [];
                scope.save({polygons: polygons});
            }

            function drawPolygon(polygon) {
                var coords = [];
                polygon.points.forEach(function(point){
                    coords.push(point.x, point.y);
                });
                polygon.figure = draw.polygon(coords);
                polygon.points.forEach(function(point){
                    if (point.figure) {
                        point.figure.node.parentElement.appendChild(point.figure.node);
                    }
                });
                polygon.figure.fill(consts.POLYGON_COLOR).opacity(consts.POLYGONS_OPACITY);
            }
            
            var draw;

            scope.$watch('imageLink',function(link){
                if (link) {
                    $http.get(link).then(function(r){
                        drawSvg(r.data);
                        initElements();
                    });
                }
            });

            function initElements() {
                if (!scope.polygons || !scope.polygons.length) {
                    return;  // there is no polygons to init
                }
                polygons = scope.polygons;
                polygons.forEach(function(polygon){
                    polygon.active = false;
                    drawPolygon(polygon);
                    polygon.points.forEach(function(el){
                        el.figure = drawPoint(el.x, el.y);
                    });
                });
            }

            function drawSvg(data) {
                createSvg(data);
                draw.click(function(e) {
                    if (!scope.editable) {
                        return;
                    }
                    scope.rectMode ? createPointsForRect(points, e) : createPoint(points, e);
                });
            }

            function createPoint(points, e) {
                points.push({
                    figure: drawPoint(e.offsetX, e.offsetY),
                    x: e.offsetX,
                    y: e.offsetY
                });
            }

            function createPointsForRect(points, e) {
                points.push({
                    figure: drawPoint(e.target.x.baseVal.value, e.target.y.baseVal.value),
                    x: e.target.x.baseVal.value,
                    y: e.target.y.baseVal.value
                });

                points.push({
                    figure: drawPoint(e.target.x.baseVal.value + e.target.width.baseVal.value, e.target.y.baseVal.value),
                    x: e.target.x.baseVal.value + e.target.width.baseVal.value,
                    y: e.target.y.baseVal.value
                });

                points.push({
                    figure: drawPoint(e.target.x.baseVal.value + e.target.width.baseVal.value, e.target.y.baseVal.value + e.target.height.baseVal.value),
                    x: e.target.x.baseVal.value + e.target.width.baseVal.value,
                    y: e.target.y.baseVal.value + e.target.height.baseVal.value
                });

                points.push({
                    figure: drawPoint(e.target.x.baseVal.value, e.target.y.baseVal.value + e.target.height.baseVal.value),
                    x: e.target.x.baseVal.value,
                    y: e.target.y.baseVal.value + e.target.height.baseVal.value
                });
            }

            function drawPoint(x,y) {
                var point = draw.circle(8).fill(consts.POINT_COLOR).opacity(consts.EDIT_POINTS_OPACITY).move(x-4, y-4);
                point.draggable().on('dragend', dragPoint);
                return point;
            }

            function dragPoint(e){
                var elements = getElementsByTargetNode(e.target);
                if (!elements) {
                    console.log('Error! Point was not found.');
                    return;
                }
                elements.point.x = e.detail.event.offsetX;
                elements.point.y = e.detail.event.offsetY;
                elements.polygon.figure && elements.polygon.figure.remove();
                drawPolygon(elements.polygon);
                scope.save({polygons: polygons});
                e.preventDefault();
                this.node.parentElement.appendChild(this.node);
                this.move(e.detail.event.offsetX-4, e.detail.event.offsetY-4)
            }

            function getElementsByTargetNode(target) {
                for (var i=0; i<polygons.length; i++) {
                    var point = polygons[i].points.find(function(el){
                        return el.figure.node === target
                    });
                    if (point) {
                        return {
                            point: point,
                            polygon: polygons[i]
                        };
                    }
                }
                return null;
            }

            function createSvg(data) {
                draw && (draw.remove());
                draw = SVG('edit-image').size(1899, 1602);
                draw.svg(data);
            }
        }
    };
});

