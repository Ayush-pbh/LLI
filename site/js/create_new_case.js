api_server = "https://lli.onrender.com/"

function createNewCase() {
    // Animate the Button
    default_inner_text = 'Submit<i class="material-icons right">send</i>';
    btn = document.getElementsByClassName('submit-new-case-btn')[0];

    btn.innerHTML = `<img src="./img/loading-ball-jump.svg" class="login-btn-animation"></img>`;
    // Trying to register!
    // Prepare the Json Data
    
    userSubmit_first_name = document.getElementById('userSubmit_first_name').value;
    userSubmit_last_name = document.getElementById('userSubmit_last_name').value;
    userSubmit_contact = document.getElementById('userSubmit_contact').value;
    animal_name = document.getElementById('animal_name').value;
    animal_type = document.getElementById('animal_type').value;
    animalIncidentType = document.getElementById('animalIncidentType').value;
    animalIncidentdescription = document.getElementById('animalIncidentdescription').value;
    animalAdditionalNotes = document.getElementById('animalAdditionalNotes').value;
    animalIncidentLocation = document.getElementById('animalIncidentLocation').value;
    caseLocationGMapLink = document.getElementById('caseLocationGMapLink').value;

    if(!userSubmit_first_name || !userSubmit_last_name || !userSubmit_contact || !animal_name || !animal_type || !animalIncidentType || !animalIncidentdescription || !animalIncidentLocation || !caseLocationGMapLink){
        
        console.log("Don't leave any field empty")
        alert("Don't leave any field empty")
        btn.innerHTML = default_inner_text

    }
    else{
        json_data = {
            userSubmitFName : userSubmit_first_name,
            userSubmitLName : userSubmit_last_name,
            userSubmitContact : userSubmit_contact,     
            caseAnimalName : animal_name,
            caseAnimalType : animal_type,
            caseIncidentType : animalIncidentType,
            description : animalIncidentdescription,
            additionalNotes : animalAdditionalNotes,
            caseLocation : animalIncidentLocation,
            caseLocationGMapLink : caseLocationGMapLink,
        }
        console.log(json_data)
        fetch(api_server+"createNewCase/",{
            method: "POST",
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : localStorage.getItem('token')
            },
            body : JSON.stringify(json_data)
        })
        .then((response)=>{
            if(response.status!=200){
                console.log("ERROR : "+response.json())
                btn.innerHTML = default_inner_text
                M.toast({html: `Error in Case creation. Try Again with Valid Query!`})
            }
            else{
                return response.json()
            }
        })
        .then((response)=>{
            if(response){
                console.log(response)
                btn.innerHTML = `Case Created!`
                M.toast({html: `Case Created Successfully!`})
            }
        })
        .catch((err)=>{
            console.log("Error : "+err)
            btn.innerHTML = default_inner_text
            M.toast({html: `Server Error! Try Again Later.`})
        })
    }

}

document.getElementsByClassName('submit-new-case-btn')[0].addEventListener('click',createNewCase)