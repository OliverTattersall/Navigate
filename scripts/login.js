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








function emailValid(email){
    alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    spec = "0123456789-~!$%^&*_=+}{'?.".split("")
    // console.log(alpha)
    allowb = new Set(alpha.concat(spec))
    allowa = new Set(alpha.concat(['-','.']))
    // console.log(allowa)
    alpha2=new Set(alpha)
    if(email.includes("@")==false){
        
        return false
    }
    email = email.split("@");
    // console.log(email)
    for(i=0;i<email[0].length;i++){
        if(allowb.has(email[0][i])===false){
            console.log("a", email[0][i])
            return false
        }
    }
    //checks for allowed characters for second part
    for(i=0;i<email[1].length;i++){
        if(allowa.has(email[1][i])==false){
            console.log("b", email[1][i])
            return false
        }
    }
    //checks if there at least 2 digits before .
    if(!(alpha2.has(email[1][email[1].length-1]) && alpha2.has(email[1][email[1].length-2]))){
        console.log("c", email[1][-1], email[1][-2])
        return false
    }

    return true
}
// emailValid("kajshdajkh@asdjkhk")



function login(){
    console.log("hello")
    email = document.getElementsByClassName("field")[0].value
    password = document.getElementsByClassName("field")[1].value

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("logged in")
            var user = userCredential.user;
            window.open("index.html", "_parent")
            // ...
        })
        .catch((error) => {
            
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.message)
        });
}


function signUp(){
    console.log("hello")
    email = document.getElementsByClassName("field")[0].value
    password = document.getElementsByClassName("field")[1].value
    // console.log(emailValid(email))
    if(emailValid(email)){
        if(passoword.length>=6){
            console.log("in")
            firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
                    // Signed in 
                    console.log("hello")
                    var user = userCredential.user;
                    // ...
                }).catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage)
                    // ..
                });
            }else{
                alert("password must be at least 6 characters long")
            }
    }else{
        alert("email not properly formatted")
    }
}