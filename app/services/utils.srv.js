app.service('Utils', function() {
    this.wheel = function(event, onUpScroll, onDownScroll) {
        var delta = 0;
        if (!event) event = window.event; // IE
        // Cross browser delta
        if (event.wheelDelta) {
            // IE, Opera, safari, chrome
            delta = event.wheelDelta/120;
        } else if (event.detail) {
            // FF
            delta = -event.detail/3;
        }
        if (delta) {
            // Cancel default scroll
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.returnValue = false; // для IE

            delta > 0 ? onUpScroll() : onDownScroll();
        }
    };
});
