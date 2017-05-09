app.directive('editImage', function ($http, consts, $timeout) {
    return {
        restrict: 'E',
        scope: {
            editable: '<',
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
                polygon.figure.fill(consts.POLYGON_COLOR);
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
                polygon.figure.fill(consts.POLYGON_COLOR);
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
                    points.push({
                        figure: drawPoint(e.offsetX, e.offsetY),
                        x: e.offsetX,
                        y: e.offsetY
                    });
                });
            }

            function drawPoint(x,y) {
                var point = draw.circle(8).fill(consts.POINT_COLOR).move(x-4, y-4);
                point.draggable().on('dragend', dragPoint);
                return point;
            }

            function dragPoint(e){
                var elements = getElementsByTargetNode(e.target);
                if (!elements) {
                    console.log('Error! Point was not found.');
                    return;
                }
                elements.point.x = e.detail.p.x;
                elements.point.y = e.detail.p.y;
                elements.polygon.figure && elements.polygon.figure.remove();
                drawPolygon(elements.polygon);
                scope.save({polygons: polygons});
                e.preventDefault();
                this.node.parentElement.appendChild(this.node);
                this.move(e.detail.p.x-4, e.detail.p.y-4)
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

