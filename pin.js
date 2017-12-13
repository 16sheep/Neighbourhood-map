
module.exports = {
    pin: function(map, latlng, name) {
        var marker;

        this.name = ko.observable(name);
        this.latlng = ko.observable(latlng);

        marker = new google
            .maps
            .Marker({
                position: new google
                    .maps
                    .LatLng(latlng),
                animation: google.maps.Animation.DROP
            });

        this.isVisible = ko.observable(false);

        this
            .isVisible
            .subscribe(function (currentState) {
                if (currentState) {
                    marker.setMap(map);
                } else {
                    marker.setMap(null);
                }
            });

        this.isVisible(true);
    }
}