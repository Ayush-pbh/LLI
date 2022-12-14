// VARIABLES
login_uri = "http://192.168.130.50:3000/login"
user_info_uri = "http://192.168.130.50:3000/userProfile"
server_host = "http://192.168.130.50:3000/"

// server_host = "http://localhost:3000/"
// login_uri = "http://localhost:3000/login"
// user_info_uri = "http://localhost:3000/userProfile"


async function loginUser(){
    // Animate the Login Button
    default_inner_text = 'Login<i class="material-icons right">send</i>';
    btn = document.getElementsByClassName('login-form-login-button')[0];

    btn.innerHTML = `<img src="./img/loading-ball-jump.svg" class="login-btn-animation"></img>`;
    // Trying to login!
    // Clear any old tokens!
    localStorage.setItem('token',null)
    mail = document.getElementById('login-form-mail').value;
    pass = document.getElementById('login-form-pass').value;
    // First perform value checks!
    let json_data = {
        "mail" : mail,
        "password" : pass
    };
    loginuser = "Ayush"
    fetch(server_host+"login/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
    })    
    .then((response)=>{
        if(response.status==401){
            return undefined
        }
        else{
            return response.json()
        }
    })
    .then((response)=>{        
        if(response){
            console.log(response.token)
            // Store the token in the local-Storage

            localStorage.setItem('token',response.token)
            
            fetch(server_host+"userProfile", {
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token' : response.token 
                }
            }).then(resp=>resp.json())
            .then((resp)=>{
                btn.innerHTML = `Welcome! ${resp.fname}`  
                M.toast({html: `Hi ${resp.fname}, Login Succesful!`})
                // Redirect to Homepage.html after 1.5 second!
                setTimeout(() => {
                    window.open('./homepage.html','_self')
                }, 1500);
            })
        }
        else{
            btn.innerHTML = default_inner_text
            M.toast({html: `Oops! Email / Password do not match!`})
        }
    })
}

// @Listener
document.getElementsByClassName('login-form-login-button')[0].addEventListener('click', loginUser);