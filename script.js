
function initMap() {
    var london = {lat: 51.513995, lng: -0.109531};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: london
    });

    getVenueData(map)

    var marker = new google.maps.Marker({
      position: london,
      map: map
    });
}

/* ko.observableArray.fn.contains = function(prop, value) {
    var val = ko.utils.unwrapObservable(value).toUpperCase();
    return ko.utils.arrayFilter(this(), function(item) {
        return ko.utils.unwrapObservable(item[prop]).toUpperCase().indexOf(val) > -1;
    });   
} */


/* Call Foursquare API to search 30 vegan places in London */
function getVenueData(map) {
  url = "https://api.foursquare.com/v2/venues/search?limit=30&query=vegan&ll=51.513995,-0.109531&client_id=5FIXMYRSCGXJBQFLYVL4Y4U13HSWCZCZBHOFOQCCBMGZYFF4&client_secret=ZQZNB1JUYU0RJPBAG04A0JQTDTMSBKBSFCFCCHB1WDCE52WS&v=20140806&m=foursquare"
  var json = {};
  $.getJSON(url, function(result){
     json = result['response']['venues'] 
     console.log(json)
     makeResults(json,map)
/*      var ViewModel = function(json) {
        var self = this;
        json = ko.observableArray();
        json['name'] = ko.observable(name)
        this.filterVenues = ko.observable("");
    };
    
    ko.applyBindings(new ViewModel());
        }, this);
        console.log(json)
        return json */
}


/* Iterate through venues and create markers and infowindow content */
function makeResults(json, map){
json.forEach(function(venue) {
    var contentString = "<div><a href='https://foursquare.com/v/" + venue['id']+ "'><h4>" + venue['name'] +
    "</h4></a></div>"

    var infowindow = new google.maps.InfoWindow({
        content: contentString
      });
 
    var latlng = {lat : venue['location']['lat'], lng: venue['location']['lng']}
    console.log(latlng)
    var marker = new google.maps.Marker({
        position: latlng,
        animation: google.maps.Animation.DROP,
        map: map,
        /* icon: isOpen(json) */
      });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

    isOpen(venue)
})
}

/* Iterate through venues and check if they are open*/
function isOpen(venue){
    url = "https://api.foursquare.com/v2/venues/" + venue['id'] + "?client_id=5FIXMYRSCGXJBQFLYVL4Y4U13HSWCZCZBHOFOQCCBMGZYFF4&client_secret=ZQZNB1JUYU0RJPBAG04A0JQTDTMSBKBSFCFCCHB1WDCE52WS&v=20140806"
       $.getJSON(url, function(result){
           if (result['response']['venue']['closed'] == true) {
               console.log("Closed")
           }
           else {
               console.log("Open")
           }
       }) 
}


/* Functions for Responsive sidebar */
$(window).resize(function() {
	var path = $(this);
	var contW = path.width();
	if(contW >= 751){
		document.getElementsByClassName("sidebar-toggle")[0].style.left="200px";
	}else{
		document.getElementsByClassName("sidebar-toggle")[0].style.left="-200px";
	}
});
$(document).ready(function() {
	$('.dropdown').on('show.bs.dropdown', function(e){
	    $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
	});
	$('.dropdown').on('hide.bs.dropdown', function(e){
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
	});
	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		var elem = document.getElementById("sidebar-wrapper");
		left = window.getComputedStyle(elem,null).getPropertyValue("left");
		if(left == "200px"){
			document.getElementsByClassName("sidebar-toggle")[0].style.left="-200px";
		}
		else if(left == "-200px"){
			document.getElementsByClassName("sidebar-toggle")[0].style.left="200px";
		}
	});
});