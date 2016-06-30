
        $(document).ready(function () {

    var map;
    var myCenter = new google.maps.LatLng(50.05768, 14.425220);
    var browserSupportFlag = new Boolean();
    function initialize()
    {
        var mapProp = {
            center: myCenter,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        google.maps.event.addListener(map, 'click', function (event) {

            placeMarker(event.latLng);
        });
    }


    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            placeMarker(initialLocation);

        }, function () {
            handleNoGeolocation(browserSupportFlag);
        });
    }
    // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {

            initialLocation = myCenter;
        } else {
            sweetAlert("Your browser doesn't support geolocation.");
            initialLocation = myCenter;
        }
        map.setCenter(initialLocation);

    }


    markersArray = [];
    placesCoordsArray = [];

    google.maps.event.addDomListener(window, 'load', initialize);

    function placeMarker(location) {


        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: "http://namut.tmweb.ru/maps/img/Marker48.png",
            marLat: location.lat(),
            marLng: location.lng(),
            markerPos: location.lat() + "," + location.lng(),
            animation: google.maps.Animation.DROP
        });

        if (location == initialLocation) {
            marker.icon = " http://namut.tmweb.ru/maps/img/PinYouAreHere48-2.png";
            var infowindow = new google.maps.InfoWindow({
                content: "Vaše poloha"});
            infowindow.open(map, marker);
        }

        var $markerLat = location.lat();
        var $markerLng = location.lng();

        $('#menuLatitude').html($markerLat.toFixed(5));
        $('#menuLongitude').html($markerLng.toFixed(5));
        $('#nazev_input').val('');
        $('#poznamky_input').val('');

        markersArray.push(marker);

        google.maps.event.addListener(marker, 'rightclick', function () {

            var i = 0;
            $.each($('.place'), function () {


                var $X = $(this).children('.latitudeLong').html();
                var $Y = $(this).children('.longitudeLong').html();
                var $pos = "" + $X + "," + $Y + "";

                if ($pos == marker.markerPos) {
                    i = i + 1;
                }
            });

            initialPos = initialLocation.lat() + "," + initialLocation.lng();

            if (marker.markerPos == initialPos) {
                sweetAlert("", "Nelze smazat váši polohu", "error");
            } else if (i == 0) {
                marker.setMap(null);
            } else {

                sweetAlert("", "Nelze smazat marker, který uložen do poznámek", "error");
            }
        });



        google.maps.event.addListener(marker, 'mouseover', function () {
            $.each($('.place'), function () {
                $(this).children('th').removeAttr("id");

                var $X = $(this).children('.latitudeLong').html();
                var $Y = $(this).children('.longitudeLong').html();
                var $pos = "" + $X + "," + $Y + "";

                if (marker.markerPos == $pos) {
                    $(this).children('th').attr("id", "active");
                }
            });
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
            $.each($('.place'), function () {
                $(this).children('th').removeAttr("id");

            });
        });

    }

    var noteWidth = $('#noteMenu').width();
    $('#poznamky_input').css({'width': noteWidth});




// zmena animace markeru pri najeti myse na radek
    function rowsOnHover() {
        $(".place").hover(function () {

            var latSTr = $(this).children(".latitudeLong").html();
            var lat = parseFloat(latSTr);
            var lngSTr = $(this).children(".longitudeLong").html();
            var lng = parseFloat(lngSTr);
            var $pos = "" + lat + "," + lng + "";

            for (var i = 0; i < markersArray.length; i++) {
                if (markersArray[i].markerPos == $pos) {
                    markersArray[i].setAnimation(google.maps.Animation.BOUNCE);
                    $(this).children('th').attr("id", "active");
                }
            }
        }
        // odjeti z radku
        , function () {
            var latSTring = $(this).children(".latitudeLong").html();
            var lat = parseFloat(latSTring);
            var lngSTring = $(this).children(".longitudeLong").html();
            var lng = parseFloat(lngSTring);
            var $pos = "" + lat + "," + lng + "";

            for (var i = 0; i < markersArray.length; i++) {
                if (markersArray[i].markerPos == $pos) {
                    markersArray[i].setAnimation(null);
                    $(this).children('th').removeAttr("id");
                }
            }
        });
    }
    ;


    var numberLoads = 0;
    $("#load").click(function () {

        if (numberLoads == 0) {
            numberLoads = numberLoads + 1;
            $.getJSON("http://namut.tmweb.ru/maps/data/places.json", function (data) {
                $.each(data, function () {
                    latitudeShort = parseFloat(this['latitude']).toFixed(5);
                    longitudeShort = parseFloat(this['longitude']).toFixed(5);
                    $('#content').append("<tr class='place'> <th class='latitudeShort'>" + latitudeShort + "</th> <th class='latitudeLong'>" + this['latitude'] + "</th> <th class='longitude'>" + longitudeShort + "</th> </th> <th class='longitudeLong'>" + this['longitude'] + "</th> <th>"
                            + this['name'] + "</th> <th>" + this['note'] + "</th> </tr>");
                    var $lat = this['latitude'];
                    var $lng = this['longitude'];

                    var marker_position = new google.maps.LatLng($lat, $lng);
                    placeMarker(marker_position);
                    var $markerLat = marker_position.lat();
                    var $markerLng = marker_position.lng();
                    var $positionMarker = $markerLat + "," + $markerLng;
                    placesCoordsArray.push($positionMarker);
                    rowsOnHover();
                });
            });

        } else {
            sweetAlert("", "Data už byli nahrány", "error");

        }
    });

    $("#save").click(function () {
        var lastMarker = markersArray[markersArray.length - 1];
        var $lat = lastMarker.marLat;
        var $lng = lastMarker.marLng;
        var latitudeShort = $lat.toFixed(5);
        var longitudeShort = $lng.toFixed(5);
        var markerPosition = $lat + "," + $lng;
        var $jmeno = $('#nazev_input').val();
        var $poznamka = $('#poznamky_input').val();
        var state = "ok";

        if ($jmeno == 0) {
            sweetAlert('', 'Zadejte název místa', 'error');
        }
        ;

        for (var i = 0; i < placesCoordsArray.length; i++) {

            if (placesCoordsArray[i] == markerPosition) {
                sweetAlert('', 'Místo již bylo uloženo', 'error');
                state = "alreday exists";
            }
        }

        if (state == "ok") {
            $('#content').append("<tr class='place'> <th class='latitudeShort'>" + latitudeShort + "</th> <th class='latitudeLong'>" + $lat + "</th> <th class='longitudeShort'>" + longitudeShort + "</th> </th> <th class='longitudeLong'>" + $lng + "</th> <th>"
                    + $jmeno + "</th> <th>" + $poznamka + "</th> </tr>");


            var $place = {
                latitude: $lat,
                longitude: $lng,
                name: $jmeno,
                note: $poznamka
            };

// odesilani na server v json soubor
            $.ajax({
                type: "POST",
                url: "http://namut.tmweb.ru/maps/data/toJson.php",
                data: $place,
                dataType: "json"
            });
            rowsOnHover();
            placesCoordsArray.push(markerPosition);

        }

    });

});