var mymap = L.map('map',{
  zoomControl:true
}).setView([44.552923140196725, -78.15305721293893], 13);
mymap.zoomControl.setPosition('topright');

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom:12,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoib2xpdmVydGF0dGVyc2FsbCIsImEiOiJja3ZzZjBpazQzN3FuMnVtdDI4ZnRyZDZtIn0.o-xBUWx2qZyqMiOrwowGdA'
}).addTo(mymap);

var marker = L.marker([44.552923140196725, -78.15305721293893]).addTo(mymap);

var markers = [marker];
var iconval=L.icon({
    iconUrl:'images/rock.png',
    iconAnchor: [15,42]

})

var lat, lng;
mymap.addEventListener('click', (ev)=>{
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
    markers.push(L.marker([lat, lng], {icon:iconval}).addTo(mymap))
    console.log(lat, lng)
    console.log(markers[0])
    // markers[0]["_icon"] = "<img src='images/marker-icon copy.png'>"
    // console.log(markers[0]["_icon"])
})

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems);
});