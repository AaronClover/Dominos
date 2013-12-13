function onTouchStart(event) {
	//do stuff
    console.log(event.changedTouches[0].clientX);
    testDomino.moveTo(event.changedTouches[0].clientX,event.changedTouches[0].clientY);
}
 
function onTouchMove(event) {
	 // Prevent the browser from doing its default thing (scroll, zoom)
	event.preventDefault(); 
    testDomino.moveTo(event.changedTouches[0].clientX,event.changedTouches[0].clientY);
} 
 
function onTouchEnd(event) { 
	//do stuff
}   