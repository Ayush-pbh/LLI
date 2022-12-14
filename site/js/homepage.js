// Variables
server_host = "http://localhost:3000/"

document.onload = fetch_user_details();

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
        positionTag = document.getElementById('position-tag')    
        user_mail = document.getElementsByClassName('c_info_user_mail')[0]    
        user_name = document.getElementsByClassName('c_info_user_name')[0]
        
        user_name.innerHTML = response.fname    
        user_mail.innerHTML = response.mail    
        positionTag.innerHTML = response.position
        if(response.position==='user'){
            document.getElementsByClassName('report-case-block')[0].classList.add('visible');
        }
    })
    .catch(err=>console.log(err))
}