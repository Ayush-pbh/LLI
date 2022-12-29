// const { response } = require("express")

function addNGO(){
    // Get All the values...
    let organisationFullname = document.getElementById('organisationFullname').value
    let officalMailId = document.getElementById('officalMailId').value
    let contactNumber = document.getElementById('contactNumber').value
    let dateOfOrigin = document.getElementById('dateOfOrigin').value
    let totalMembers = document.getElementById('totalMembers').value
    let totalActiveMembers = document.getElementById('totalActiveMembers').value
    
    let shelterI = document.getElementsByName('shelterGroup')
    let shelter = (shelterI[0].checked)?"yes":"no"
    
    let address = document.getElementById('address').value
    let addCity = document.getElementById('add-city').value
    let addDistrict = document.getElementById('add-district').value
    let addState = document.getElementById('add-state').value
    let addPincode = document.getElementById('add-pincode').value
    let ngo_logo = document.getElementById('ngo_logo').value
    let ngo_documents = document.getElementById('ngo_documents').value
    
    let boardM1_fullname = document.getElementById('boardM1_fullname').value
    let boardM1_mail = document.getElementById('boardM1_mail').value
    let boardM1_contact = document.getElementById('boardM1_contact').value
    let boardM1_position = document.getElementById('boardM1_position').value
    
    let boardM2_fullname = document.getElementById('boardM2_fullname').value
    let boardM2_mail = document.getElementById('boardM2_mail').value
    let boardM2_contact = document.getElementById('boardM2_contact').value
    let boardM2_position = document.getElementById('boardM2_position').value
    
    let boardM3_fullname = document.getElementById('boardM3_fullname').value
    let boardM3_mail = document.getElementById('boardM3_mail').value
    let boardM3_contact = document.getElementById('boardM3_contact').value
    let boardM3_position = document.getElementById('boardM3_position').value

    // Check for empty values and reoprt them!
    if(!organisationFullname || !officalMailId || !contactNumber || !dateOfOrigin || !totalMembers || !totalActiveMembers || !address || !addCity || !addDistrict || !addState || !addPincode || !ngo_logo || !ngo_documents || !boardM1_fullname || !boardM1_mail || !boardM1_contact || !boardM1_position || !boardM2_fullname || !boardM2_mail || !boardM2_contact || !boardM2_position || !boardM3_fullname || !boardM3_mail || !boardM3_contact || !boardM3_position){
        alert("Please Don't Leave Any Field Empty!");
        // return 1;
    }
    jsonToGo = {
        ngoFullName : organisationFullname,
        ngoOfficialMail : officalMailId,
        ngoOfficialContact : contactNumber,
        ngoDateOfEstablishment : dateOfOrigin,
        ngoTotalMembers : totalMembers,
        ngoActiveMembers : totalActiveMembers,
        ngoShelterStatus : shelter,
        ngoAddress : address,
        ngoAddCity : addCity,
        ngoAddDistrict : addDistrict,
        ngoAddState : addState,
        ngoAddPincode : addPincode,
        ngoLogoUrl : ngo_logo,
        ngoDocumentsUrl : ngo_documents,
        ngoBoardMembers : [
            {
                fullname : boardM1_fullname,
                mail : boardM1_mail,
                contact : boardM1_contact,
                position : boardM1_position
            },
            {
                fullname : boardM2_fullname,
                mail : boardM2_mail,
                contact : boardM2_contact,
                position : boardM2_position
            },
            {
                fullname : boardM3_fullname,
                mail : boardM3_mail,
                contact : boardM3_contact,
                position : boardM3_position
            },
        ]
    }

    console.log(jsonToGo)
    // Now fetch if up
    fetch(api_server+"registerNGO/" ,{

    method: "POST",
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token' : localStorage.getItem('token')
        },
        body : JSON.stringify(jsonToGo)
    })
    .then((response)=>{
        if(response.status==200){
            console.log("Success")
            console.log(response.json())
        }
        else{
            console.log("Faliure")
            console.log(response.json())
        }
    })
}
