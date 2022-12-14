document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems, {});
});

function toggleUserProfileDP() {
    dpholder = document.getElementsByClassName('dp-holder')[0];
    dpholder.classList.toggle('dp-holder-full');
}

window.onload = setup()
window.onload = fetch_user_details()

function setup() {
    current_user_name = document.getElementsByClassName('current_user_name')[0];
    current_user_mail = document.getElementsByClassName('current_user_mail')[0];
    current_user_phone = document.getElementsByClassName('current_user_phone')[0];
    current_user_position = document.getElementsByClassName('current_user_position')[0];   

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
        // User Info
        current_user_name.innerHTML = response.fname + " " + response.lname    
        current_user_mail.innerHTML =  `<h6><i class="material-icons">mail</i> ${response.mail}</h6>`    
        current_user_phone.innerHTML = `<i class="material-icons">phone</i> ${response.phone}`
        current_user_position.innerHTML = `<i class="material-icons">person</i>Position : ${response.position}`    
        
        if(response.position==='volunteer'){
            document.getElementsByClassName('karma-section')[0].classList.add('visible');
        }
    })
    .catch(err=>console.log(err))
}
