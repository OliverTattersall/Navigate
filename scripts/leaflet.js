
var rock=false;
var poly=false;
var rocks=[];
var polygons=[];

var mymap = L.map('map',{zoomControl:true})
mymap.setView([44.552923140196725, -78.15305721293893], 13);


// updates map to their location if allowed
function updateMap(){
    // console.log(userData)
    if(userData[3]){
        navigator.geolocation.getCurrentPosition((e)=>{
            mymap.setView([e.coords.latitude, e.coords.longitude], 13)
        }) 
        // navigator.geolocation.getCurrentPosition((e)=>{
        //     mymap.setView([e.coords.latitude, e.coords.longitude], 12)
        // }) 
    }
}

function getLoc(){
    console.log("hello")
    if(userData[3]){
        navigator.geolocation.getCurrentPosition((e)=>{
            mymap.setView([e.coords.latitude, e.coords.longitude], 12)
        })
    }
}


mymap.zoomControl.setPosition('topright');

//fix this
// L.control.scale().addTo(map);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom:12,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoib2xpdmVydGF0dGVyc2FsbCIsImEiOiJja3ZzZjBpazQzN3FuMnVtdDI4ZnRyZDZtIn0.o-xBUWx2qZyqMiOrwowGdA'
}).addTo(mymap);

//creates marker onload



var iconval=L.icon({
    iconUrl:'images/rock.png',
    iconAnchor: [15,42]

})


// onclick
var lat, lng;
points = []
mymap.addEventListener('click', (ev)=>{
    // console.log(mymap.zoom)
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;

    //gets a popup info
    if(!poly&&!rock&&rocks.length!=0){
        zoom = mymap._zoom-12

        d = 0.005
        loc = -1
        // console.log(rocks)
        for(i=0;i<rocks.length;i++){
            var temp = rocks[i]._latlng
            var d2 = Math.sqrt((temp['lat']-lat)**2+(temp['lng']-lng)**2)
            d2 = d2*(2**zoom)
            // console.log(rocks[i]._latlng)
            if(d2<d){
                loc=i
                d=d2
            }
        }
        if(loc!=-1){
            rocks[loc].openPopup();
        }
        // console.log(d)
        


    }
    // adds a rock
    if(rock){
        description = prompt("Add description to rock if need(can leave blank)")
        // console.log(description)
        if(description!=null){
            rocks.push(L.marker([lat, lng], {icon:iconval}).addTo(mymap))
            if(description!=""){
                rocks[rocks.length-1].bindPopup(description)
            }
            let lake = document.getElementById("lakes").value
            temppath = "lakes/"+lake+"/Rocks"
            // console.log(temppath)
            var info = [lat, lng, description]
            addToDatabase(temppath, info)
        }


      
    //   console.log(lat, lng)
    //   console.log(rocks[0])
      rock=false


    // adds points to the polygon
    }else if(poly){
        points.push([lat, lng])
        
    }

    // rocks[0]["_icon"] = "<img src='images/marker-icon copy.png'>"
    // console.log(rocks[0]["_icon"])
})

document.addEventListener('keyup', (ev)=>{
    if(poly){
        if(ev.code=='Space'){
            console.log('hello')
            poly=false
            descrip = prompt("Add description to DangerZone for more information if needed(can leave blank):")
            
            polygons.push(L.polygon(points, {color: 'red'}).addTo(mymap));
            if(descrip!==""){
                polygons[polygons.length-1].bindPopup(descrip)
            }
        }
    }


})


//load rocks and danger zones
function loadRocks(){
    x = getFromDatabase("/lakes/Stony Lake/Rocks/")
    // console.log(x)
    x.then((e)=>{
        console.log(e)
        keys = Object.keys(e)
        
        console.log(e[keys])
        for(i=0; i<keys.length; i++){
            rocks.push(L.marker([e[keys[i]][0], e[keys[i]][1]], {icon:iconval}).addTo(mymap))
        }
    })
    // console.log(x['PromiseResult'])
}


