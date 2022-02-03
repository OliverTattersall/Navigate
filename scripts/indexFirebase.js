
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

      var uid = user.uid;
      database.ref('users/'+uid).once('value',(v)=>{
        d = v.val()
        vals = [d['UserName'], d['email'], d['HomeLocation'], d['Location'], d['lake']]
        userData = vals;
        loadInfo(vals)
        updateMap()
        loadRocks()
      } )

      
      
      
      // ...
  } else {
    var uid = 'test'
      console.log("no")
      database.ref('users/test').once('value',(v)=>{
        d = v.val()

        vals = [d['UserName'], d['email'], d['HomeLocation'], d['Location'], d['lake']]
        loadInfo(vals)
        userData = vals;
        updateMap()
        loadRocks()
        loadStars(d["FavLocs"])
      } )
      
      // user is not signed in redirect them to login page
      // window.open("login.html", "_parent")
      // User is signed out
      // ...
  }
});


function loadInfo(data){
  // console.log(data)
  userInfo = document.getElementsByClassName("info")

  
  userInfo[0].innerHTML +=" "+data[0]
  userInfo[1].innerHTML +=" "+data[1]
  console.log(data[2])
  if(!data[2]){
    userInfo[2].innerHTML +=" Not Set"
  }else{
    userInfo[2].innerHTML +=" Set"
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


  console.log(lakes.length)
  for(i=0;i<selectOptions.length;i++){
    if(selectOptions[i].value ==data[4]){
      document.getElementById('lakes').selectedIndex = i;

      M.FormSelect.init(lakes)

    }
  }

}




//add stuff to database
function addToDatabase(path, data){
  database.ref(path).push(data).then(()=>{
    console.log("updated")
  }).catch((error) => {
    console.error(error);
  });
}


//read from database --- fix this
function getFromDatabase(path){
  var temp = []
  return database.ref(path).once('value').then((e)=>{
    // console.log(e.val())
    return e.val()
  }).catch((error) => {
    console.error(error);
  });

}

function logOut(){
  console.log("hello")
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}