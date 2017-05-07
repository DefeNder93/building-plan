app.directive('editImage', function ($http) {
    return {
        restrict: 'E',
        scope: {
            editable: '<',
            api: '='
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
            
            var draw = SVG('edit-image').size(1899, 1602);

            $http.get('img/floor1.svg').then(function(r){
                draw.svg(r.data);
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
            });
        }
    };
});

