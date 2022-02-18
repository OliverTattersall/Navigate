
// Firebase Js
var uid;
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


var users=[]
var userpairs=[]
var homeLocs


firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
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
var test = [];
firebase.auth().onAuthStateChanged((user) => {
  // console.log("hello")
  if (user) {
      // console.log("in")
      // console.log(user.uid)
      // User is signed in, see docs for a list of available properties

      uid = user.uid;
      database.ref('users/'+uid).once('value',(v)=>{
        d = v.val()
        vals = [d['UserName'], d['email'], d['HomeLocation'], d['Location'], d['lake'], d['Home']]
        userData = d;

        loadInfo(vals)
        updateMap()

        loadStars(d["FavLocs"])
      } ).then(()=>{
        database.ref('users/userNames').once('value', (v)=>{
          users = new Set(Object.values(v.val()))
          userpairs=v.val()
        })
      })
      database.ref('users/homeLocs').once('value',(v)=>{
        homeLocs=v.val()
      }).then(()=>{
        loadFriends(userData['Friends'])
      })
      
      
      
      // ...
  } else {
      uid = 'test'
      // console.log("no")
      database.ref('users/test').once('value',(v)=>{
          d = v.val()
          // console.log(d)
          vals = [d['UserName'], d['email'], d['HomeLocation'], d['Location'], d['lake'], d['Home']]
          
          userData = d;
          loadInfo(vals)
          updateMap()
          
          loadStars(d["FavLocs"])
          
          
      }).then(()=>{
        database.ref('users/userNames').once('value', (v)=>{
          users = new Set(Object.values(v.val()))
          userpairs=v.val()
        })
      })

      database.ref('users/homeLocs').once('value',(v)=>{
        homeLocs=v.val()
      }).then(()=>{
        loadFriends(userData['Friends'])
      })
      
      // user is not signed in redirect them to login page
      // window.open("login.html", "_parent")
      // User is signed out
      // ...
  }
});


function loadInfo(data){
  if(data[4]==null){
    alert("select which lake you would like to look at using the dropdown")
  }
  if(data[5]!=null){
    L.marker(data[5], {icon:houseIcon}).addTo(mymap)
  }
  // console.log(data)
  userInfo = document.getElementsByClassName("info")

  
  userInfo[0].innerHTML +=" "+data[0]
  userInfo[1].innerHTML +=" "+data[1]
  // console.log(data[2])
  if(!data[2]){
    userInfo[2].innerHTML +=" No"
  }else{
    userInfo[2].innerHTML +=" Yes"
    
  }

  if(!data[3]){
    userInfo[3].innerHTML +=" Inactive"
  }else{
    userInfo[3].innerHTML +=" Active"
  }

  //update lake 
  // document.getElementById('lakes').selectedIndex=1;
  var selectElement = document.getElementById('lakes')
  var selectOptions = selectElement.options



  for(i=0;i<selectOptions.length;i++){
    if(selectOptions[i].value ==data[4]){
      document.getElementById('lakes').selectedIndex = i;

      M.FormSelect.init(lakes)

    }
  }
  // loadRocks()
  changeMapView()

}




//add stuff to database
function addToDatabase(path, data){
  database.ref(path).push(data).then(()=>{
    console.log("updated")
  }).catch((error) => {
    console.error(error);
  });
}



// read from database 
function getFromDatabase(path){
  var temp = []
  return database.ref(path).once('value').then((e)=>{
    // console.log(e.val())
    return e.val()
  }).catch((error) => {
    console.error(error);
  });

}

function deleteFromDatabase(path){
  firebase.database().ref(path).remove()
}


function logOut(){
  // console.log("hello")
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}




Array.prototype.insert = function ( index, item ) {
  this.splice( index, 0, item );
};  

String.prototype.format = String.prototype.format || function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

var og;
var sidenavInfo;

function editInfo(){

  sidenavInfo = document.getElementById('userInfo');
  og=sidenavInfo.innerHTML;
  // console.log(sidenavInfo.innerHTML)

  // console.log(userData)
  let temp = '<li><a class="subheader" style="width:50%; margin-right: 0%;">User Info</a><button onclick="editInfo()">Edit</button></li>, \
  <li><p href="#name"><span class="black-text name sub info">Username: </span></p></li>, \
  <li><p href="#email"><span class="black-text email sub info">email: test@test.com</span></p></li>, \
  <li><p href="#email"><span id="home" class="black-text email sub info">Show Home Location to Friends:</span></p></li>, \
  <li><p href="#email"><span id="loc" class="black-text email sub info">Current Location:</span></p></li>'.split(",")
  // console.log(temp)
  let inp = '<div class="input-field col s5 offset-s1  change">\
  <input value="'+userData['UserName']+'" id="edits" type="text" class="validate">\
  </div>' 
  let rad='  <div class="switch  change" id="homeLoc"><label>\
    Off\
    <input type="checkbox" class="switches" id = "homeLoc2">\
    <span class="lever"></span>\
    On\
  </label></div>'
  // console.log(rad)

  let rad2 = '  <div class="switch change" id="getLoc"><label>\
  Off\
  <input type="checkbox" class="switches" id="getLoc2">\
  <span class="lever"></span>\
  On\
</label></div>'
  temp.insert(2, inp)
  temp.insert(5,rad)
  temp.insert(7, rad2)
  temp.insert(9, '<div class="change"><a class="waves-effect waves-light btn sidebtn" onclick="saveSideNav()">Save</a><a class="waves-effect waves-light btn sidebtn" onclick="cancelChanges()">Cancel</a></div>')
  let end=""
  for(i=0;i<temp.length;i++){
    end+=temp[i]
  }
  sidenavInfo.innerHTML=end;
  // console.log(userData)
  document.getElementById('homeLoc2').checked = userData['HomeLocation']
  document.getElementById('getLoc2').checked = userData['Location']
}


function saveSideNav(){

  let val = document.getElementById('edits').value
  let rads = document.getElementsByClassName('switches')


  userInfo = document.getElementsByClassName("info")
  // console.log(userInfo)

  if(users.has(val)&&val!=userData['UserName']){
    alert("username taken")
    return
  }

  //updates sidenav
  userInfo[0].innerHTML ="Username: "+val

  if(!rads[0].checked){
    userInfo[2].innerHTML ="Show Home Location to Friends: No"
  }else{
    userInfo[2].innerHTML ="Show Home Location to Friends: Yes"
  }

  if(!rads[1].checked){
    userInfo[3].innerHTML ="Current Location: Inactive"
  }else{
    userInfo[3].innerHTML ="Current Location: Active"
  }

  database.ref('users/'+uid).update({
    HomeLocation:rads[0].checked,
    Location:rads[1].checked,
    UserName:val
  })

  //updates username database
  if(val!=userData['UserName']){
    for(i=0;i<Object.values(userpairs).length;i++){
      if(userData['UserName']==Object.values(userpairs)[i]){
        let key = Object.keys(userpairs)[i]
        database.ref('users/userNames/'+key).remove()
        users.delete(userData['UserName'])
        let newkey = database.ref('users/userNames/').push(val).key;
        users.add(val)
        database.ref('users/friendsCanView/'+userData['UserName']).remove()
        database.ref('users/friendsCanView/').update({
          [val]:rads[0].checked
        })
        delete userpairs[key]
        userpairs[newkey]=val
        database.ref('users/homeLocs/'+userData['UserName']).remove()
  
      }
    }
  }

  database.ref('users/friendsCanView/').update({
    [val]:rads[0].checked
  })
  if(rads[0].checked){
    database.ref('users/homeLocs/').update({
      [val]:userData['Home']
    })
  }else{
    database.ref('users/homeLocs/'+val).remove()
  }
  userData['HomeLocation']=rads[0].checked
  userData['Location']=rads[1].checked
  userData['UserName']=val

  let hide = document.getElementsByClassName('change')
  for(i=0;i<hide.length;i++){
    hide[i].innerHTML=""
  }



}

function cancelChanges(){
  sidenavInfo.innerHTML=og;
}


function addFriend(){
  console.log("hello")
  friendName = prompt("enter friends Username")
  if(friendName!=null){
    if(users.has(friendName)){
      database.ref('users/'+uid+'/Friends/').push(friendName).then(()=>{
        alert("success")
      })
    }else{
      alert('User does not exist')
    }
  }
}