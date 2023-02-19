

// VARIABLES
// api_server = "http://192.168.43.168:8080/"
// api_server = "http://localhost:8080/"
api_server = "/"
// api_server = "https://lli.onrender.com/"

// login_uri = "http://192.168.130.114:3000/login"
// user_info_uri = "http://192.168.130.114:3000/userProfile"
// server_host = "http://192.168.130.68:3000/"
// server_host = "http://localhost:3000/"
// login_uri = "http://localhost:3000/login"
// user_info_uri = "http://localhost:3000/userProfile"

function toggleSidenav() {
    setupSidenav()
    console.log("Wierd!")
    sidenav = M.Sidenav.init(document.querySelectorAll('#slide-out'));
    sidenav[0].open();
}


function fetch_user_details() {
    
    fetch(api_server + "userProfile/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
        },
    })
        .then(response => response.json())
        .then((response) => {
            localSet('currentLoginUser', response, true)
            console.log("Current User Login data set to localStorage")
            // user_mail = document.getElementsByClassName('c_info_user_mail')[0]    
            // user_name = document.getElementsByClassName('c_info_user_name')[0]
            // user_name.innerHTML = response.fname    
            // user_mail.innerHTML = response.mail    

            if (response.position === 'user') {
                document.getElementsByClassName('report-case-block')[0].classList.add('visible');
            }
        })
        .catch(err => console.log(err))
}



function logoutCurrentUser() {
    localStorage.setItem('token', 'false')
    localSet('currentLoginUser', '')
    window.open('./login.html', '_self')
}
function setupSidenav() {

    let userInfo = localGet('currentLoginUser', true)
    document.getElementsByClassName('c_info_user_name')[0].innerHTML = userInfo.fname + ' ' + userInfo.lname
    document.getElementsByClassName('c_info_user_mail')[0].innerHTML = userInfo.mail
    document.getElementById('position-tag').innerHTML = userInfo.position

    if (userInfo.position == 'volunteer') {
        // Add MyGallry Page
        // Add Case History Page
        // document.getElementsByClassName('case-history')[0].classList.remove('invisible')
        // document.getElementsByClassName('my-gallery')[0].classList.remove('invisible')
        // Green Button changes
        document.getElementsByClassName('voln-green-button')[0].classList.remove('hidden')
        document.getElementsByClassName('navbar-icon-chat')[0].classList.add('visible')
    }
    else if (userInfo.position == 'ngo-admin') {
        // document.getElementsByClassName('my-ngo-volunteers')[0].classList.remove('invisible')
        // document.getElementsByClassName('ongoing-cases')[0].classList.remove('invisible')
        document.getElementsByClassName('my-ngo')[0].classList.remove('invisible')

        document.getElementsByClassName('caselist-link')[0].classList.add('invisible')
        document.getElementsByClassName('create-new-case-link')[0].classList.add('invisible')
        document.getElementsByClassName('ngoadmin-green-button')[0].classList.remove('hidden')
        document.getElementsByClassName('aboutapp-link')[0].classList.add('invisible')
        document.getElementsByClassName('appsettings-link')[0].classList.add('invisible')
        document.getElementsByClassName('apphelp-link')[0].classList.remove('invisible')
        // document.getElementsByClassName('my-ngo')[0].classList.remove('invisible')

        // document.getElementsByClassName('top-right-navbar-icon')[1].innerHTML = '<i class="material-icons">notifications</i>'
        document.getElementsByClassName('navbar-icon-notifi')[0].classList.add('visible')
    }
    else if (userInfo.position == 'user') {
        document.getElementsByClassName('caselist-link')[0].classList.add('invisible')
        document.getElementsByClassName('viewcaseonmap-link')[0].classList.add('invisible')
        document.getElementsByClassName('create-new-case-link')[0].classList.add('invisible')
        document.getElementsByClassName('aboutapp-link')[0].classList.add('invisible')
        document.getElementsByClassName('appsettings-link')[0].classList.add('invisible')
        document.getElementsByClassName('apphelp-link')[0].classList.remove('invisible')
        document.getElementsByClassName('user-green-button')[0].classList.remove('hidden')
        document.getElementsByClassName('navbar-icon-chat')[0].classList.add('visible')
        document.getElementsByClassName('report-case-block')[0].classList.add('visible');

    }
    removePlate()
    if(userInfo.profilepicurl=='000'){
        // Prompt User to Setup Profile Picture!
        
    }
    else{
        document.getElementsByClassName('user-display-picture')[0].src = `/${userInfo.profilepicurl}`
    }

}
function localSet(key, value, obj = false) {
    if (obj) {
        localStorage.setItem(key, JSON.stringify(value))
    }
    else {
        localStorage.setItem(key, value)
    }
}
function localGet(key, obj = false) {
    if (obj) {
        return JSON.parse(localStorage.getItem(key))
    }
    else {
        return localStorage.getItem(key)
    }
}
function verifyLogin() {
    if (localGet('token') == 'false') {
        return false;
    }
    else {
        return true;
    }
}


function removePlate() {
    gsap.to('.plate', { left: '100%', duration: .3 })
}


function goToPageWithAnimation(uri) {

    console.log("Running animation and then moving to the page")

    setTimeout(() => {
        window.open(uri, '_self')
    }, 350);

    gsap.to('.plate', { left: '-100%', duration: 0 })
    gsap.to('.plate', { left: 0, duration: .3 })

}
var socket = undefined

function initSocket(){
    socket = io();
    
    let loginToken = localStorage.getItem('token')
    let myId = localGet('currentLoginUser',true)._id

    if(localGet('currentLoginUser').position == 'volunteer'){

        // Send the init event to the socket controller so that we get init and added to a room
        socket.emit("init-off",
        {
            userId : myId,
            loginToken : loginToken
        }
        , (resp)=>{
            console.log(resp)
        })
        // Now after initializing.
        // Setup all the events.
        socket.on("from-console", (arg)=>{
            console.log("Wiredly awesome : "+arg)
        })
    }
    else{

        // Send the init event to the socket controller so that we get init and added to a room
        socket.emit("init-user",
        {
            userId : myId,
            loginToken : loginToken
        }
        , (resp)=>{
            console.log(resp)
        })
        // Now after initializing.
        // Setup all the events.
        socket.on("from-console", (arg)=>{
            console.log("Wiredly awesome : ")
            console.log(arg)
            // alert(`Got Message from Console : ${arg.msg}`)
            // Now we need to add this alert notification...
            //  to The user screen. Turn on the flash of the user...
            // Torch and Vibrate
            ddf()
            // Show Notification
            if(arg.msg.description){
                document.getElementsByClassName('shared-info')[0].innerHTML = arg.msg.description + "<hr>"+arg.msg.additionalNotes
                document.getElementsByClassName('submiterinfo')[0].innerHTML = `<span>${arg.msg.userSubmitFName +' '+ arg.msg.userSubmitLName}</span><br><span>${arg.msg.userSubmitContact}</span>`
            }
            else{
                document.getElementsByClassName('shared-info')[0].innerHTML = arg.msg

            }
            
            toggleNavigationPane()
            
        })
        // socket.on("from-console", (arg)=>{

        // })
    }
}
