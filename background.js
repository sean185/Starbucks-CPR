///////////////////
// Starbucks CPR //
///////////////////

/*
Allow user to activate from the popup
Keep track of internet connection by pinging e.g https://www.google.com
	If the request ends up redirected, we know it is under starbucks captive portal
		then make get request to http://sb.login.org/login?username=dsuser&password=dspass
*/

var external_ip = null
var at_starbucks = false
var start_time = null

var handleResponse = function() {
	// console.log('readyState', this.readyState)
	// console.log('status', this.status)
	if (this.responseURL.includes("sb.login") || this.responseURL.includes("starbucks")) {
		at_starbucks = true
	}
	if (this.readyState == 4 && this.status == 302 && this.responseURL.startsWith("http://sb.login.org")) {
		console.log("timeout detected, reconnecting!")
		reconnect(this)
		return
	}
    if (this.readyState == 4 && this.status == 200) {
		start_time ? null : start_time = new Date()
		if (this.responseText.length <= 15) {
			// all clear
			// console.log("success!")
			external_ip = this.responseText
		}
		else {
			// likely the case where user hits the captive portal, without internet access
			external_ip = null
			start_time = null
			console.log("did not land on whatsmyip.co")
			console.log(this.responseURL)
			console.log(this.getAllResponseHeaders())
		}
		return
    }
	// if somehow still uncaught
	return
};

var ping = function(xhr) {
	xhr.open("GET", "http://whatsmyip.co/");
	xhr.send();
}

var reconnect = function(xhr) {
	xhr.open("GET", "http://sb.login.org/login?username=dsuser&password=dspass");
	xhr.send();
}

console.log("CPR background.js init");

var XHR = new XMLHttpRequest();
XHR.onreadystatechange = handleResponse

ping(XHR)
setInterval( function(){
	ping(XHR)
}, 10000)
