
function sendFPOtp(){
    let mail = document.getElementById('confirm-mail-form-mail').value
    if(mail){
        // Now sending request!
        fetch(api_server+'sendForgotPasswordOtp/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail : mail
            })})
            .then((resp)=>{
                if(resp.status==422){
                    M.toast({html:"No User with that email found!"})
                }
                else{
                    M.toast({html:"Enter the OTP, and send the new password query"})
                    return resp.json()
                }
            })
            .then((resp)=>{
                let otpHolder = document.getElementById('temp-otp-holder')
                otpHolder.innerHTML = "OTP : "+resp.otp
                console.log(resp)
            })
    }
    else{
        Map.toast({html:"Please Fill the mail."})
    }
}

function verifyOTPAndChangePassword(){
    
    let mail = document.getElementById('confirm-mail-form-mail').value
    let otp = document.getElementById('otp').value
    let newPass = document.getElementById('newPassword').value
    if(mail && otp && newPass){
        // Now sending request!
        fetch(api_server+'forgotPasswordVerify/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail : mail,
                otp: otp,
                newPass: newPass
            })})
            .then((resp)=>{
                if(resp.status==422){
                    M.toast({html:"Wrong OTP"})
                }
                else{
                    M.toast({html:"Password Changed! Login Now"})
                    setTimeout(() => {
                        window.open('login.html','_self')
                    }, 1000);
                }
            })
    }
    else{
        Map.toast({html:"Please fill in valid details."})
    }

}