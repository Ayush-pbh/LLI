function go(uri) {
    console.log("Running animation and then moving to the page")
    setTimeout(() => {
        window.open(uri,'_self')
    }, 350);
    gsap.to('.plate', {left:'-100%', duration:0})
    gsap.to('.plate', {left:0, opacity:1,duration:.3})

}

window.onload = function(){
    // Remove the plate when the whole app is loaded
    gsap.to('.plate', {left:'100%',opacity:0, duration:.3})
}