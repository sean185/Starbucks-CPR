///////////////////
// Starbucks CPR //
///////////////////

/*
Allow user to activate from the popup
Keep track of internet connection by pinging e.g https://www.google.com
	If the request ends up redirected, we know it is under starbucks captive portal
		then make get request to http://sb.login.org/login?username=dsuser&password=dspass
*/

var ping_url = "http://whatsmyip.co/"
var success_url = "http://sb.login.org/login?username=dsuser&password=dspass"
var external_ip = null
var at_starbucks = false
var start_time = null
var reconnects = 0

var openURL = function(xhr, url) {
	xhr.open("GET", url, true);
	xhr.send();
}

var handleResponse = function() {
	// console.log('readyState', this.readyState)
	// console.log('status', this.status)
	if (this.responseURL.includes("sb.login") || this.responseURL.includes("starbucks")) {
		at_starbucks = true
	}
    if (this.readyState == 4 && this.status == 200) {
		if (this.responseURL.includes("sb.login.org/login?dst")) {
			console.log("timeout detected!")
			openURL(this, success_url);
			reconnects += 1;
		}
		else {
			if (this.responseURL == success_url) {
				console.log("reconnect attempted!")
			}
			else if (this.responseText.length <= 15) {
				// all clear
				// console.log("success!")
				start_time ? null : start_time = new Date()
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
		}
	}
	return
};


console.log("CPR background.js init");

var XHR = new XMLHttpRequest();
XHR.onreadystatechange = handleResponse

// kickoff with the first ping
openURL(XHR, ping_url);

intvl_id = setInterval( function(){
	openURL(XHR, ping_url)
}, 10000);
console.log("setInterval id: " + intvl_id)