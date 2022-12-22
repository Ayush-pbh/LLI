/*
    Functions!!!
    
    getJoinedCases()
    getJoinedCasesHtml()

*/


function getHtmlElement(obj,type,number){
    // Object is the case object 
    // type is the type of the user (user,volunteer)
    if(type==='volunteer'){
        htmlquery = `<div class="row volunteer-caselist">
                        <div class="col s12 m6">
                          <div class="card border-radius-curve" style="background-color: #2D637A;">
                            <div class="card-content white-text">
                                <span class="card-title">${obj.caseAnimalName}</span>
                                <div class="row">
                                    <div class="col s6">
                                    <br>
                                    <img class="materialboxed" width="150" src="img/injured-dog.jpg">
                                  </div>
                                  <div class="col s6 ">
                                    <blockquote>
                                        <b>Problem</b> <br>
                                        ${obj.additionalNotes}
                                    </blockquote>
                                    <blockquote>
                                        <b>Description</b> <br>
                                        ${obj.description}
                                    </blockquote>
                                  </div>
                              </div>
                            </div>
                            <div class="card-action border-radius-curve-card-below">
                              <a class="activator">More Info</a>
                              <a href="#">Jump to chat!</a>
                              <i class="material-icons right green-text">people</i>
                              <span class="right case-vacany-counter green-text lighten-2">${number}/6</span>
                            </div>
                            <div class="card-reveal white-text" style="background-color: #2D637A;">
                                <span class="card-title ">${obj.caseAnimalName}<i class="material-icons right">close</i></span>
                                <blockquote class="flow-text">
                                    <b>Problem</b> <br>
                                    ${obj.additionalNotes}
                                </blockquote>
                                <blockquote class="flow-text">
                                    <b>Description</b> <br>
                                    ${obj.description}
                                </blockquote>
                                <blockquote class="flow-text">
                                    <b>Location</b> <br>
                                    <a href="${obj.caseLocationGMapLink}">View on Map</a>
                                    
                                </blockquote>
                              </div>
                          </div>
                        </div>
                    </div>
                    `
        return htmlquery
    }
    else{
        htmlquery = `<li>
        <div class="collapsible-header">${obj.caseAnimalName}</div>
        <div class="collapsible-body">
            <div class="row">

                <div class="col s6">
                    <img class="materialboxed" width="150" src="img/injured-dog.jpg">
                </div>
                <div class="col s6">
                    <h5 class="t-playfair">${obj.additionalNotes}</h5>
                    <p>${obj.description}</p>
                    <a class="waves-effect green lighten-1 waves-light btn"><i class="material-icons right">send</i>More</a>
                </div>
            </div>
        </div>
    </li>`
    return htmlquery
    }
}

function getJoinedCases() {
    // Fetch Joined Cases & then create list then write to innerHtml
    let loadingGif = document.getElementsByClassName('loading-gif')[0]
    // Check if the current user is a user or a volunteer
    pos = localGet('currentLoginUser',true).position
    
    if(pos==='volunteer'){
        // Get volunteer casesFeed from server
        fetch(api_server+"getVolJoinedCases/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : localStorage.getItem('token')
            },
        })
        .then(response=>response.json())
        .then((response)=>{
            // Remove the loading gif animation
            loadingGif.style.display = 'none';
            caselist = response.message
            let elemList = ""
            M.toast({html: `Cases Loaded!`})
            caselist.slice().reverse().forEach(mycase => {
                let number = mycase.volunteerList.length
                elemList+=(getHtmlElement(mycase, 'volunteer',number))
            });
            // Push it into the ul tag!
            // console.log(elemList)
            caselistHolder = document.getElementsByClassName('volunteer-caselist-holder')[0]
            caselistHolder.innerHTML = elemList
        })
        .catch(err=>console.log(err))
    }
    else{
        // Get user created cases from server
        fetch(api_server+"getUserGeneratedCases/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : localStorage.getItem('token')
            },
        })
        .then(response=>response.json())
        .then((response)=>{
            // Remove the loading gif animation
            console.log(response)
            loadingGif.style.display = 'none';
            caselist = response.message
            let elemList = ""
            M.toast({html: `Cases Loaded!`})

            caselist.slice().reverse().forEach(mycase => {
                let number = mycase.volunteerList.length
                elemList+=(getHtmlElement(mycase, 'user',number))
            });
            // Push it into the ul tag!
            // console.log(elemList)
            caselistHolder = document.getElementsByClassName('user-caselist-holder')[0]
            caselistHolder.innerHTML = elemList
        })
        .catch(err=>console.log(err))
        
    }
}


window.onload = function(){
    getJoinedCases()
}