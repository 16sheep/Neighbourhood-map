
var allPins = [];

function Pin(map, latlng, name, markerColor, contentString) {
    var marker;

    this.name = name;
    this.latlng = latlng;
    var infowindow = new google
        .maps
        .InfoWindow({content: contentString});

    marker = new google
        .maps
        .Marker({
            position: new google
                .maps
                .LatLng(latlng),
            icon: markerColor,
            animation: google.maps.Animation.DROP
        });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    marker.addListener('click', toggleBounce);

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

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

/* Google maps API callback to create map */
function initMap() {
    var london = {
        lat: 51.513995,
        lng: -0.109531
    };
    var map = new google
        .maps
        .Map(document.getElementById('map'), {
            zoom: 12,
            center: london
        });

    getVenueData(map)
}

/* Call Foursquare API to search 30 vegan places in London */
function getVenueData(map) {
    url = "https://api.foursquare.com/v2/venues/search?limit=20&query=vegan&ll=51.513995,-0" +
            ".109531&client_id=FOURSQUARE_ID&client_secret" +
            "=FOURSQUARE_SECRET&v=20140806&m=foursquare"
    var json = {};
    $.getJSON(url, function (result) {
        isResponseEmpty(result)
        json = result['response']['venues']
        json.forEach(function (venue) {
            isOpen(venue, map)
        })
        setViewModel(json)
    }).fail(function(errorThrown) { alert('FourSquare api request failed! ' + errorThrown + '! More info in browser console'); })
}

/* Iterate through venues and check if they are open and call makeMarkers to create markers with colour based on if they are open or not*/
function isOpen(venue, map) {
    var openImage = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        closedImage = "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        unknownImage = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        url = "https://api.foursquare.com/v2/venues/" + venue['id'] + "?client_id=FOURSQUARE_ID&client_secret=FOURSQUARE_SECRET&v=20140806"


    $.getJSON(url, function (result) {
        isResponseEmpty(result)
        if (result['response']['venue']['hours'] == undefined) {
            makeMarkers(venue, map, unknownImage)
        } else if (result['response']['venue']['hours']['isOpen'] == true) {
            makeMarkers(venue, map, openImage)
        } else {
            makeMarkers(venue, map, closedImage)
        }
    }).fail(function(errorThrown) { alert('FourSquare api request failed! ' + errorThrown + '! More info in browser console'); })
}

/*  Create markers and infowindow content for each venue*/
function makeMarkers(venue, map, markerColor, json) {
    var contentString = "<div><a href='https://foursquare.com/v/" + venue['id'] + "'><h4>" + venue['name'] + "</h4></a></div>",
        latlng = {
            lat: venue['location']['lat'],
            lng: venue['location']['lng']
        },
        currentpin = new Pin(map, latlng, venue['name'], markerColor, contentString)

    allPins.push(currentpin)
}

/* Alert user if empty json response */
function isResponseEmpty(result) {
    if (!result['response'] || result['response'] === {}) {
        alert(", Something went wrong with call to FourSquare")
    }
}

/* ViewModel*/
function setViewModel(json) {
    var viewModel = {
        json: ko.observableArray([]),
        allPins: ko.observableArray([]),
        query: ko.observable(''),
        search: function (value) {
            viewModel
                .json
                .removeAll();

            for (var venue in json) {
                if (json[venue].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    viewModel
                        .json
                        .push(json[venue]);
                }
            }
            console.log(value)
            for (var pin in allPins) {
                if (allPins[pin].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    allPins[pin].isVisible(true)
                } else {
                    allPins[pin].isVisible(false)
                }
            }
        }
    };

    viewModel
        .query
        .subscribe(viewModel.search);
    ko.applyBindings(viewModel);

}

/* Functions for Responsive sidebar */
$(window)
    .resize(function () {
        var path = $(this);
        var contW = path.width();
        if (contW >= 751) {
            document.getElementsByClassName("sidebar-toggle")[0].style.left = "300px";
        } else {
            document.getElementsByClassName("sidebar-toggle")[0].style.left = "-300px";
        }
    });
$(document).ready(function () {
    $("#menu-toggle")
        .click(function (e) {
            e.preventDefault();
            var elem = document.getElementById("sidebar-wrapper");
            left = window
                .getComputedStyle(elem, null)
                .getPropertyValue("left");
            if (left == "300px") {
                document.getElementsByClassName("sidebar-toggle")[0].style.left = "-300px";
            } else if (left == "-300px") {
                document.getElementsByClassName("sidebar-toggle")[0].style.left = "300px";
            }
        });
});