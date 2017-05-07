app.directive('editImage', function ($http) {
    return {
        restrict: 'E',
        scope: {
            editable: '<',
            api: '=',
            imageLink: '='
        },
        link: function(scope, el, attrs) {
            scope.api = {
                clear: clear,
                save: save
            };

            var points = [],
                polygon = null;
            
            function clear() {
                points.forEach(function(point){
                    point.figure.remove();
                });
                points = [];
            }

            function save() {
                var coords = [];
                points.forEach(function(point){
                    coords.push(point.x, point.y);
                });
                polygon = draw.polygon(coords);
                points.forEach(function(point){
                    point.figure.node.parentElement.appendChild(point.figure.node);
                });
                polygon.fill('#f06');
            }
            
            var draw;

            scope.$watch('imageLink',function(link){
                if (link) {
                    $http.get(link).then(function(r){
                        drawSvg(r.data);
                    });
                }
            });

            function drawSvg(data) {
                createSvg(data);
                draw.click(function(e) {
                    if (!scope.editable) {
                        return;
                    }
                    var figure = draw.circle(8).fill('green').move(e.offsetX-4, e.offsetY-4);
                    points.push({
                        figure: figure,
                        x: e.offsetX,
                        y: e.offsetY
                    });

                    figure.draggable().on('dragend', function(e){
                        var point = points.find(function(el){
                            return el.figure.node === e.target
                        });
                        point.x = e.detail.p.x;
                        point.y = e.detail.p.y;
                        polygon && polygon.remove();
                        save();
                        e.preventDefault();
                        this.node.parentElement.appendChild(this.node);
                        this.move(e.detail.p.x-4, e.detail.p.y-4)
                    })
                });
            }

            function createSvg(data) {
                draw && (draw.remove());
                draw = SVG('edit-image').size(1899, 1602);
                draw.svg(data);
            }
        }
    };
});

