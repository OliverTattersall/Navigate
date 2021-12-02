function emailValid(email){
    allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!$%^&*_=+}{'?-.".split()
    allow = new Set(allowed)
    if(email.includes("@")==false){
        return false
    }
    email = email.split("@");
    console.log(email)
    for(i=0;i<email[0].length;i++){
        if(allow.has(email[0][i])==false){
            return false
        }
    }

    return true
}
emailValid("kajshdajkh@asdjkhk")

