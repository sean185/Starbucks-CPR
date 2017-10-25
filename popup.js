///////////////////
// Starbucks CPR //
///////////////////

bgvars = chrome.extension.getBackgroundPage()

var stringify2mmss = function(ms) { 
	var mins = Math.floor(ms/1000/60);
	var secs = Math.floor(ms/1000) - mins*60;
	return mins + " m " + secs + " s";
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('starbucks').innerHTML = bgvars.at_starbucks ? "Yes!" : "no ._."
	document.getElementById('connected').innerHTML = bgvars.external_ip ? bgvars.external_ip : "no :("
	document.getElementById('duration').innerHTML = bgvars.start_time ? stringify2mmss(new Date() - bgvars.start_time) : "-"
})

console.log("CPR popup.js init");
