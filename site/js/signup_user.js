api_server = "https://lli.onrender.com/"

document.getElementsByClassName('register-form-register-button')[0].addEventListener('click', registerUser);
document.getElementsByClassName('register-form-register-button')[1].addEventListener('click', ()=>{
    window.open("./confirm_email_phone.html","_self")
});


async function registerUser(){
    // Animate the Login Button
    default_inner_text = 'Register<i class="material-icons right">send</i>';
    btn = document.getElementsByClassName('register-form-register-button')[0];

    btn.innerHTML = `<img src="./img/loading-ball-jump.svg" class="login-btn-animation"></img>`;
    // Trying to register!
    // Prepare the Json Data
    
    fname = document.getElementById('first_name').value
    lname = document.getElementById('last_name').value
    mail = document.getElementById('email').value
    phone = document.getElementById('phone').value
    password = document.getElementById('password').value
    cpassword = document.getElementById('cpassword').value
    cpassword = document.getElementById('cpassword').value
    position = document.getElementById('position').value
    dob = document.getElementById('dob').value
    if(!fname || !lname || !mail || !phone || !password || !cpassword || !cpassword || !position || !dob){
        alert("Field Left Empty!")
        btn.innerHTML = default_inner_text
        return undefined
    }
    
    let json_data = {
        "fname" : fname,
        "lname" : lname,
        "mail" : mail,
        "phone" : phone,
        "password" : password,
        "cpassword" : cpassword,
        "dob" : dob,
        "position" : position
    }
    
    fetch(api_server+"register/",{
        method: "POST",
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(json_data)
    })
    .then((response)=>{
        if(response.status==422){
            alert("ERROR : "+response.json().error)
        }
        else{
            return response.json()
        }
    })
    .then((response)=>{
        if(response){
            console.log(response)
            btn.innerHTML = `User Registered!`
            document.getElementById('OTP').innerHTML = response.otp
            document.getElementById('OTP-frame').classList.add('visible')
            
        }
    })
    .catch((err)=>{
        console.log("Error : "+err)
        btn.innerHTML = default_inner_text
    })
    // console.log(json_data)

}


// For all the dropdowns
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
    M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  });

function dropdownClicked(e){
    let position_field = document.getElementById('position');
    let dropdown_btn = document.getElementById('dropdown-btn');
    if(e=="user"){
        position_field.value = "user"
        dropdown_btn.innerHTML = "User"
    }
    else if(e=="volunteer"){
        position_field.value = "volunteer"
        dropdown_btn.innerHTML = "Volunteer"
    }
    else if(e=="ngo-admin"){
        position_field.value = "ngo-admin"
        dropdown_btn.innerHTML = "NGO-Admin"
    }
    else{

    }
}