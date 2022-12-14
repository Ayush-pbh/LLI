// VARIABLES
login_uri = "http://192.168.130.114:3000/login"
user_info_uri = "http://192.168.130.114:3000/userProfile"
server_host = "http://192.168.130.50:3000/"
// login_uri = "http://localhost:3000/login"
// user_info_uri = "http://localhost:3000/userProfile"

function toggleSidenav() {
    console.log("Wierd!")
    sidenav = M.Sidenav.init(document.querySelectorAll('#slide-out'));
    sidenav[0].open();
}


function fetch_user_details() {
    fetch(server_host+"userProfile/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token' : localStorage.getItem('token')
        },
    })
    .then(response=>response.json())
    .then((response)=>{
        user_mail = document.getElementsByClassName('c_info_user_mail')[0]    
        user_name = document.getElementsByClassName('c_info_user_name')[0]
        user_name.innerHTML = response.fname    
        user_mail.innerHTML = response.mail    
        
        if(response.position==='user'){
            document.getElementsByClassName('report-case-block')[0].classList.add('visible');
        }
    })
    .catch(err=>console.log(err))
}
document.getElementsByClassName('logout-link')[0].addEventListener('click', logoutCurrentUser)
function logoutCurrentUser() {
    localStorage.setItem( 'token','' )
    window.open('./login.html', '_self')
}