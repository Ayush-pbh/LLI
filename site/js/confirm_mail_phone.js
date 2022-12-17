api_server = "https://lli.onrender.com/"

function validateEmailViaOTP() {
    // Animate the Validate Button
    default_inner_text = 'Validate<i class="material-icons right">send</i>';
    btn = document.getElementsByClassName('validate-otp-btn')[0];

    btn.innerHTML = `<img src="./img/loading-ball-jump.svg" class="login-btn-animation"></img>`;
    mail = document.getElementById('confirm-mail-form-mail').value
    mailSecret = document.getElementById('confirm-mail-form-otp').value
    let json_data = {
        mail : mail,
        mailSecret : mailSecret
    }
    fetch(api_server+"confirmEmail/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
    }).then((response)=>{
        if(response.status==401){
            return undefined
        }
        else{
            return response.json()
        }
    })
    .then((response)=>{
        if(response){
            console.log(response)
            btn.innerHTML = "Success!"
            M.toast({html: `Email Validated. Please Login!`})
            setTimeout(() => {
                window.open('./login.html','_self')
            }, 2000);
        }
        else{
            btn.innerHTML = default_inner_text
            console.log("Invalid OTP Provided")
            M.toast({html: `Invalid OTP. Email Not Validated.`})
        }
    })
    .catch((err)=>{
        console.log(err)
        btn.innerHTML = default_inner_text
    })
}


document.getElementsByClassName('validate-otp-btn')[0].addEventListener('click', validateEmailViaOTP)