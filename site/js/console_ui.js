document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
});
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {});

  });
// Global Variables
let totalUsers = 100;
let totalOff = 100;
let totalUsersList = Array();
let totalUsersListSocketId = Array();
// init socket.
var socket = io();

// Send the init event to the socket controller so that we get init and added to a room
socket.emit("init-console",{}, (resp)=>{
    console.log(resp)
})

socket.on("new-user", (arg)=>{
    console.log("New User Came")
    M.toast({html: `New Police Van Online`})

    console.log(arg)
    
    if(!totalUsersList.includes(arg.userId)){
        // If the User already does not exsisit
        // Update the Official User Count
        totalOff +=1;
        totalUsers +=1;
    
        document.getElementsByClassName('tau')[0].innerHTML = totalUsers
        document.getElementsByClassName('tau')[1].innerHTML = totalOff
        
        totalUsersList.push(arg.userId)
        totalUsersListSocketId.push(arg.socketId)
    }
    else{
        // User is already counted
    }
    
})
socket.on('to-flash-console', (arg)=>{
    console.log(arg)
    localSet('sos_location', arg.msg, true)
    window.open('mapview_console.html', '_')
})
socket.on('user-disconnected', (arg)=>{
    console.log(arg)
    if(totalUsersListSocketId.includes(arg.socketId)){
        
        totalOff -=1;
        totalUsers -=1;
        document.getElementsByClassName('tau')[0].innerHTML = totalUsers
        document.getElementsByClassName('tau')[1].innerHTML = totalOff

        let temp = Array()
        totalUsersListSocketId.forEach(sockId => {
            if(sockId!=arg.socketId){
                temp.push(sockId)
            }
            else{
                // Get the index
                let ind = totalUsersListSocketId.indexOf(sockId)
                if (ind > -1) { // only splice array when item is found
                totalUsersList.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        });
        totalUsersListSocketId = temp
    }
})
function searchOff() {
    let input = document.getElementById('searchbar').value
    input=input.toLowerCase();
    let x = document.getElementsByClassName('off-list');
      
    for (i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="list-item";                 
        }
    }
}


function sendEvent(){
    let tt = document.getElementById('textarea1').value;
    console.log("Sending WebSocket Event -> "+tt)
    socket.emit("to-user", {
        msg : tt,
        targetRoom : "all-users"
    }, (_)=>console.log("Jo"))
}