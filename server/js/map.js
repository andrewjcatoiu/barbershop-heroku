function initMap() {
    const mapElement = document.getElementById("map");
    const location = { lat: 41.7093, lng: -88.2079};	

    const map = new google.maps.Map(mapElement, {
        center: location,
        zoom: 17,
        disableDefaultUI: true
    });

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url:'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    const contentString = 
        '<div><a style="width: 50%; height: auto;" href="https://www.google.com/maps/place/Studio+95+Barbers/@41.7093099,-88.2104449,17z/data=!3m1!4b1!4m6!3m5!1s0x880ef70063c84e73:0x9c197e5e44d6cb86!8m2!3d41.7093059!4d-88.20787!16s%2Fg%2F1tg5vn74?entry=ttu">3020 Reflection Dr Suite 106, Naperville, IL 60564</a></div>'
        
    const infoWindow = new google.maps.InfoWindow({
        content: contentString        
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    })
}