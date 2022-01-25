// Leaflet Js

var rock=true;


var mymap = L.map('map',{
  zoomControl:true
}).setView([44.552923140196725, -78.15305721293893], 13);
mymap.zoomControl.setPosition('topright');
map.locate({setView: true, watch: true, maxZoom: 17});
map.once('locationfound', onLocationFound);

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
var marker = L.marker([44.552923140196725, -78.15305721293893]).addTo(mymap);

var markers = [marker];
var iconval=L.icon({
    iconUrl:'images/rock.png',
    iconAnchor: [15,42]

})


// onclick for rock placements
var lat, lng;
mymap.addEventListener('click', (ev)=>{
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
    if(rock){
      markers.push(L.marker([lat, lng], {icon:iconval}).addTo(mymap))
      console.log(lat, lng)
      console.log(markers[0])
    }
    // markers[0]["_icon"] = "<img src='images/marker-icon copy.png'>"
    // console.log(markers[0]["_icon"])
})



// Materialize Js


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems);
});

//dropdown initialization
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
  console.log(elems[0])
});



// Firebase Js

const config = {
  apiKey: "AIzaSyCx3XEp_L0OViWBsb4uSCi76hAkiiBmnTU",
  authDomain: "navigate-5ba1a.firebaseapp.com",
  databaseURL: "https://navigate-5ba1a-default-rtdb.firebaseio.com",
  projectId: "navigate-5ba1a",
  storageBucket: "navigate-5ba1a.appspot.com",
  messagingSenderId: "195224192661",
  appId: "1:195224192661:web:b3a5aa8a1769fb0afb7d9c",
  measurementId: "G-R8PRK1EG56"
};

// Initialize Firebase
firebase.initializeApp(config);
const database = firebase.database();

// var lakes = ["Stony Lake", "Lake Muskoka", "Lake of Bays", "Lake Chandos"]



firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

var userData = [];
firebase.auth().onAuthStateChanged((user) => {
  console.log("hello")
  if (user) {
      console.log("in")
      console.log(user.uid)
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      database.ref('users/'+uid).once('value',(v)=>{
        d = v.val()
        vals = [d['UserName'], d['email'], d['HomeLocation'], d['Location'], d['lake']]
        userData = vals;
        loadInfo(vals)
      } )
      
      
      // ...
  } else {
      console.log("no")
      database.ref('users/test').once('value',(v)=>{
        d = v.val()
        vals = [d['UserName'], d['email'], d['HomeLocation'], d['Location'], d['lake']]
        loadInfo(vals)
      } )
      // User is signed out
      // ...
  }
});


function loadInfo(data){
  console.log(data)
  userInfo = document.getElementsByClassName("info")

  
  userInfo[0].innerHTML +=" "+data[0]
  userInfo[1].innerHTML +=" "+data[1]
  if(data[2]==="false"){
    userInfo[2].innerHTML +=" Not Set"
  }else{
    userInfo[2].innerHTML +=" Set"
  }

  if(data[3]==="false"){
    userInfo[3].innerHTML +=" Inactive"
  }else{
    userInfo[3].innerHTML +=" Active"
  }

  //update lake 
  // document.getElementById('lakes').selectedIndex=1;
  var selectElement = document.getElementById('lakes')
  var selectOptions = selectElement.options


  console.log(lakes.length)
  for(i=0;i<selectOptions.length;i++){
    if(selectOptions[i].value ==data[4]){
      document.getElementById('lakes').selectedIndex = i;

      M.FormSelect.init(lakes)

    }
  }

}




// updateInfo(["Oliver", "test@test.com", "Not Set", "Inactive"])