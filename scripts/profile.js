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
var userContent;

var users=[];
database.ref("users/userNames/").once('value').then((e)=>{

    users = Object.values(e.val())
    users = new Set(users)
})

firebase.auth().onAuthStateChanged((user) => {
    console.log("hello")
    if (user) {
        console.log("in")
        console.log(user.uid)
        // User is signed in, see docs for a list of available properties
  
        userContent=user;
        // console.log(uid, user.email)
        
        
        
        // ...
    } else {
        
        // user is not signed in redirect them to login page
        window.open("login.html", "_parent")
        // User is signed out
        // ...
    }
  });


function setUp(){
    let val = document.getElementById('locSwitch').checked
    let home = document.getElementById('HomeSwitch').checked
    let userName = document.getElementById('Uname').value;

    console.log(val, userName)
    if(userName!=''&&userName!="friendsCanView"&&userName!="userNames"){
        if(!users.has(userName)){
            console.log(userContent.uid, userContent.email)
            alert("wait for data to be processed")
            database.ref("/users/"+userContent.uid).set({
                email:userContent.email,
                UserName: userName,
                Location:val,
                HomeLocation:home
            }).then(()=>{
                database.ref("/users/userNames").push(userName).then(()=>{
                    database.ref("users/friendsCanView/").update({
                        [userName]:home
                    }).then(()=>{
                        window.open("index.html", "_parent")
                    })
                })
                
            })
        }else{
            alert('User Name is taken')
        }


        
    }
}