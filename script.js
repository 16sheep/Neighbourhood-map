var allPins = [];

 function Pin(map, latlng, name, markerColor, contentString) {
    var marker;

    this.name = name;
    this.latlng = latlng;
    var infowindow = new google.maps.InfoWindow({
          content: contentString 
      });

    marker = new google
        .maps
        .Marker({
            position: new google
                .maps
                .LatLng(latlng),
            icon: markerColor,
            animation: google.maps.Animation.DROP
        });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
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

/* Google maps API callback to create map */
function initMap() {
    var london = {lat: 51.513995, lng: -0.109531};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: london
    });

    getVenueData(map)
}


/* Call Foursquare API to search 30 vegan places in London */
function getVenueData(map) {
  url = "https://api.foursquare.com/v2/venues/search?limit=30&query=vegan&ll=51.513995,-0.109531&client_id=5FIXMYRSCGXJBQFLYVL4Y4U13HSWCZCZBHOFOQCCBMGZYFF4&client_secret=ZQZNB1JUYU0RJPBAG04A0JQTDTMSBKBSFCFCCHB1WDCE52WS&v=20140806&m=foursquare"
  var json = {};
  $.getJSON(url, function(result){
     isResponseEmpty(result) 
     json = result['response']['venues'] 
     json.forEach(function(venue) {
     isOpen(venue,map)
    })
    setViewModel(json)
    })
}


/* Iterate through venues and check if they are open*/
function isOpen(venue,map){
    var openImage = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    var closedImage = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    var unknownImage = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
    
    url = "https://api.foursquare.com/v2/venues/" + venue['id'] + "?client_id=5FIXMYRSCGXJBQFLYVL4Y4U13HSWCZCZBHOFOQCCBMGZYFF4&client_secret=ZQZNB1JUYU0RJPBAG04A0JQTDTMSBKBSFCFCCHB1WDCE52WS&v=20140806"
    var open = ""   
    $.getJSON(url, function(result){
        isResponseEmpty(result)
        console.log(result) 
        if (result['response']['venue']['hours'] == undefined){
            makeMarkers(venue, map, unknownImage)
        }
        else if (result['response']['venue']['hours']['isOpen'] == true) {
            makeMarkers(venue, map, openImage)
           }
           else {
            makeMarkers(venue, map, closedImage)
           } 
       })
}

/*  Create markers and infowindow content for each venue*/
function makeMarkers(venue, map, markerColor, json){
    var contentString = "<div><a href='https://foursquare.com/v/" + venue['id']+ "'><h4>" + venue['name'] +
    "</h4></a></div>"
 
    var latlng = {lat : venue['location']['lat'], lng: venue['location']['lng']}
<<<<<<< HEAD
    var currentpin = new Pin(map, latlng, venue['name'], markerColor, contentString)
    
    
    allPins.push(currentpin)
=======
    console.log(latlng)
    var marker = new google.maps.Marker({
        position: latlng,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: markerColor
      });
    console.log(marker)
>>>>>>> 583ded5d599554aece61363249a5489bceab680d

}


<<<<<<< HEAD


=======
>>>>>>> 583ded5d599554aece61363249a5489bceab680d
/* Alert user if empty json response */
function isResponseEmpty(result){
    if (result['response'].length == 0){
        alert("Empty response")
    }
}


/* ViewModel*/
function setViewModel (json) {
var viewModel = {
    json: ko.observableArray([]),
    allPins: ko.observableArray([]),
    query: ko.observable(''),
    search: function(value) {
      viewModel.json.removeAll();
  
      if (value == '') return;
  
      for (var venue in json) {
        if (json[venue].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          viewModel.json.push(json[venue]);
<<<<<<< HEAD
        } 
      }
      console.log(value)
      for(var pin in allPins) {
           if (allPins[pin].name.toLowerCase().indexOf(value.toLowerCase()) <  0){
              allPins[pin].isVisible(false)    
         }
=======

        }
>>>>>>> 583ded5d599554aece61363249a5489bceab680d
      }
    }
  };
  
  viewModel.query.subscribe(viewModel.search);
  ko.applyBindings(viewModel);

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