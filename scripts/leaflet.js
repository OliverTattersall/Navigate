//define global variables 
var rock=false;
var poly=false;
var star=false;
var home=false;
var rocks=[];
var polygons=[];
var stars = [];
var bounds;

var mymap = L.map('map',{zoomControl:true})
mymap.setView([44.552923140196725, -78.15305721293893], 13);


// updates map to their location if allowed
function updateMap(){

    if(userData['Location']){
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
    if(userData['Location']){
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



var rockIcon=L.icon({
    iconUrl:'images/rock.png',
    iconAnchor: [15,42]

})
var starIcon = L.icon({
    iconUrl:'images/star.png',
    iconAnchor: [15,42]
})
var houseIcon=L.icon({
    iconUrl:'images/house.png',
    iconAnchor: [8,20]
})


// onclick
var lat, lng;
points = []
mymap.addEventListener('click', (ev)=>{
    console.log(star)
    // console.log(mymap.zoom)
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;

    //Opens a popup
    // makes sure the user does not want to 
    if(!poly&&!rock&&rocks.length!=0 && !star&&!home){
        // get map zoom
        zoom = mymap._zoom-12

        //define variables
        d = 0.005
        loc = -1

        //loops through rocks and check if distance from rock to mouseclick is smaller than the current distance
        for(i=0;i<rocks.length;i++){
            var temp = rocks[i]._latlng
            var d2 = Math.sqrt((temp['lat']-lat)**2+(temp['lng']-lng)**2)
            d2 = d2*(2**zoom)

            if(d2<d){
                loc=i
                d=d2
            }
        }
        //if the pointer has changed, open the popup at that rock
        if(loc!=-1){
            rocks[loc].openPopup();
        }

        
    }

    // adds a rock
    if(rock){
        if(lat>bounds[0][0] || lat<bounds[1][0]||lng>bounds[0][1]||lng<bounds[1][1]){
            alert("not within lake, change lake location by dropdown")
        }else{
            description = prompt("Add description to rock if need(can leave blank)")
            // console.log(description)
            if(description!=null){
                rocks.push(L.marker([lat, lng], {icon:rockIcon}).addTo(mymap))
                if(description!=""){
                    rocks[rocks.length-1].bindPopup(description)
                }
                let lake = document.getElementById("lakes").value
                let temppath = "lakes/"+lake+"/Rocks"
                // console.log(temppath)
                var info = [lat, lng, description]
                addToDatabase(temppath, info)
            }
        }



      
    //   console.log(lat, lng)
    //   console.log(rocks[0])
      rock=false


    // adds points to the polygon
    }else if(poly){
        points.push([lat, lng])
        
    }else if(star){
        description = prompt("Add description to new location(cannot leave blank)")
        


            while(description=="" && description!=null){
                description= prompt("Add description to new location(cannot leave blank)")
            }
            if(description!=null){
                stars.push(L.marker([lat, lng], {icon:starIcon}).addTo(mymap))

                stars[stars.length-1].bindPopup(description)

                
                let temppath = "users/"+uid+"/FavLocs"
                // console.log(temppath)
                var info = [lat, lng, description]
                addToDatabase(temppath, info)
                
            }
            
        star = false;
    }else if(home){
        L.marker([lat,lng], {icon:houseIcon}).addTo(mymap);
        database.ref('users/'+uid).update({
            Home:[lat, lng]
        })
        home=false;
    }

    // rocks[0]["_icon"] = "<img src='images/marker-icon copy.png'>"
    // console.log(rocks[0]["_icon"])
})

document.addEventListener('keyup', (ev)=>{
    
    if(poly){
        if(ev.code=='Space'){
            // console.log('hello')
            if(points.length>=3){
                let lake = document.getElementById("lakes").value
                poly=false
                descrip = prompt("Add description to DangerZone for more information if needed(can leave blank):")

                polygons.push(L.polygon(points, {color: 'red'}).addTo(mymap));
                if(descrip!==""){
                    polygons[polygons.length-1].bindPopup(descrip)
                    points.push(descrip)
                }else{
                    points.push("")
                }
                let temppath = "lakes/"+lake+"/DangerZones/"
                addToDatabase(temppath, points)
            }else{
                poly = false
            }
            
        }
    }if(ev.code=="Backspace"){
        for(i=0;i<rocks.length;i++){
            
            if(rocks[i]._popup!=null){
                if(rocks[i]._popup.isOpen()){
                    x = confirm("Are you sure you want to delete the rock")
                    console.log(x)
                    let lake = document.getElementById('lakes').value
                    if(x){
                        rocks[i].remove()
                        console.log(rocks[i].key)
                        deleteFromDatabase('lakes/'+lake+'/Rocks/'+rocks[i].key)
                    }
                }
            }
            
        }
    }


})


//load rocks and danger zones and favourite locations
function loadRocks(){
    let lake = document.getElementById("lakes").value
    // console.log(dropDown)
    // let lake = document.getElementById("lakes").value
    // console.log(dropDown)
    x = getFromDatabase("/lakes/"+lake+"/")
    
    // console.log(x)
    x.then((e)=>{
        // console.log(e)
        bounds=e['Bounds']
        keys1 = []
        keys2 = []
        if(e['Rocks']!=null){
            keys1 = Object.keys(e["Rocks"])
        }
        if(e['DangerZones']!=null){
            keys2 = Object.keys(e["DangerZones"])
        }
        

        
        // console.log(e[keys])
        for(i=0; i<keys1.length; i++){
            rocks.push(L.marker([e["Rocks"][keys1[i]][0], e["Rocks"][keys1[i]][1]], {icon:rockIcon}).addTo(mymap))
            if(e["Rocks"][keys1[i]][2]!=""){
                rocks[i].bindPopup(e["Rocks"][keys1[i]][2])
            }
            rocks[i].key=keys1[i];
        }
        // console.log(e["DangerZones"][keys2[0]])
        for(i=0;i<keys2.length;i++){
            var temp = e["DangerZones"][keys2[i]]
            polygons.push(L.polygon(temp.slice(0,temp.length-1), {color: 'red'}).addTo(mymap))
            // console.log(temp[temp.length-1])
            if(temp[temp.length-1]!=""){
                polygons[polygons.length-1].bindPopup(temp[temp.length-1][0])
            }
            
        }
    })
}

function loadStars(data){
    if(data==null){
        return 
    }
    console.log(data)
    let keys = Object.keys(data)
    for(i=0;i<keys.length;i++){
        console.log(data[keys[i]])
        stars.push(L.marker(data[keys[i]].slice(0,2), {icon:starIcon}).addTo(mymap).bindPopup(data[keys[i]][2]))
    }
}


//updates map to different lakes
function changeMapView(){
    for(i=0;i<rocks.length;i++){
        rocks[i].remove()
    }
    for(i=0;i<polygons.length;i++){
        polygons[i].remove()
    }
    let selectVal = document.getElementById('lakes').value;
    if(selectVal!=''){
        console.log(selectVal)
        let tempData = getFromDatabase("lakes/"+selectVal+"/Bounds/")
        tempData.then((val)=>{
            console.log(val)
            let x = (val[0][0]+val[1][0])/2
            let y = (val[0][1]+val[1][1])/2
            mymap.setView([x, y], 12);
        })
        rocks = []
        loadRocks()
    }
    
}


