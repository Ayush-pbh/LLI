// Variables
server_host = "http://localhost:3000/"
api_server = "https://lli.onrender.com/"


document.onload = init(); 
function init(){
    verifyLogin()
    fetch_user_details()
    setTimeout(() => {
        setupSidenav()
    }, 1000);
}

function fetch_user_details() {
    fetch(api_server+"userProfile/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token' : localStorage.getItem('token')
        },
    })
    .then(response=>response.json())
    .then((response)=>{
        localSet('currentLoginUser',response,true)        
        // if(response.position==='user'){
        //     document.getElementsByClassName('report-case-block')[0].classList.add('visible');
        // }
    })
    .catch(err=>console.log(err))
}

// Ui related functions
