function init(){
    // Check for the case id 
    let caseId = localStorage.getItem('case-info-case-id')
    if(caseId){
        console.log("Redirect Case Id Found!")
        // Fetch Case info and then write it to the dom!
        // Basic Case Info, DOcuments Uploaded, Financial Reports. etc.
        fetch(api_server+'getCaseInfo/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : localStorage.token
            },
            body : JSON.stringify({caseid : caseId})
        })
        .then((resp)=>{
            if(resp.status == 400){
                alert("No Redirect Case Id Were Found, Redirecting to Homepage in 5 Seconds")
                // setTimeout(()=>{window.open('homepage.html','_self')}, 5000)
            }
            else if(resp.status == 200){
                return resp.json()
            }
        })
        .then((resp)=>{
            // Start altering the dom!
            let basicDetails = `
        <div class="col s12">
            <h5 class=" vN-address">
                Animal Name : ${resp.caseAnimalName}
            </h5>
        </div>
        <div class="col s12">
            <h5 class=" vN-address">
                Animal Type : ${resp.caseAnimalType}
            </h5>
        </div>
        <div class="col s12">
            <h5 class=" vN-address">
                Illness Type : ${resp.caseIncidentType}
            </h5>
        </div>
        <div class="col s12">
            <h5 class=" vN-address">
                Description : ${resp.description}
            </h5>
        </div>  
        <div class="col s12">
            <h5 class=" vN-address">
                Additional Notes : ${resp.additionalNotes}
            </h5>
        </div>  
        `
        let technicalDetails = `
        <div class="col s12">
            <h5 class=" vN-address truncate">
                Location : ${resp.caseLocation}
            </h5>
        </div>
        <div class="col s12">
            <h5 class=" vN-address truncate">
                Location Link : ${resp.caseLocationGMapLink}
            </h5>
        </div>
        <div class="col s12">
            <h5 class=" vN-address">
                Case Status : ${resp.caseStatus}
            </h5>
        </div>
        <div class="col s12">
            <h5 class=" vN-address">
                Case Created Date : ${resp.caseGenerateDate}
            </h5>
        </div>
        <hr>
        <div class="col s12">
            <h5 class=" vN-address">
                Submiter Name : ${resp.userSubmitFName +" "+ resp.userSubmitLName}
            </h5>
        </div>
        <div class="col s12">
            <h5 class=" vN-address">
                Submiter Contact : ${resp.userSubmitContact}
            </h5>
        </div>
        `
        // Now write it to the DOM
        document.getElementsByClassName('case-basic-details')[0].innerHTML = basicDetails
        document.getElementsByClassName('case-tech-details')[0].innerHTML = technicalDetails
        // Making the Volunteer List
        fetch(api_server+'getVolunteerName/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : localStorage.token
            },
            body : JSON.stringify({caseid : caseId})
        })
        .then((re)=>{
            if(re.status==200){
                return re.json()
            }
        })
        .then((re)=>{
            vol = ""
            re.forEach(r => {
                vol+=`<a href="#!" class="collection-item">${r}</a>`
            });
            document.getElementsByClassName('voln-list-coll')[0].innerHTML = vol
        })
        })
    }
    else{
        console.log("Redirect Case Id Not Found!")
    }
}


window.addEventListener('load', function(){
    init()
})

function removePlate() {
    gsap.to('.plate', { left: '100%', duration: .3 })
}