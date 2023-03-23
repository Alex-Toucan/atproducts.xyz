var _____WB$wombat$assign$functionalt_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; }; }
{
  let window = _____WB$wombat$assign$functionalt_____("window");
  let self = _____WB$wombat$assign$functionalt_____("self");
  let document = _____WB$wombat$assign$functionalt_____("document");
  let location = _____WB$wombat$assign$functionalt_____("location");
  let top = _____WB$wombat$assign$functionalt_____("top");
  let parent = _____WB$wombat$assign$functionalt_____("parent");
  let frames = _____WB$wombat$assign$functionalt_____("frames");
  let opener = _____WB$wombat$assign$functionalt_____("opener");

// --- Config --- //
var purecookieTitle = "Cookies."; // Title
var purecookieDesc = "By using this website, you automatically accept that we use cookies."; // Description
var purecookieLink = '<a href="/privacy#cookies" target="_blank" rel="noopener noreferrer">Why?</a>'; // Cookiepolicy link
var purecookieButton = "Understood"; // Button text
// ---        --- //


function pureFadeIn(elem, display){
  var el = document.getElementById(elem);
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .02) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};
function pureFadeOut(elem){
  var el = document.getElementById(elem);
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .02) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
};

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

function cookieConsent() {
  if (!getCookie('purecookieDismiss')) {
    document.querySelector('div#page').innerHTML += '<div class="cookieConsentContainer" id="cookieConsentContainer"><div class="cookieTitle"><a>' + purecookieTitle + '</a></div><div class="cookieDesc"><p>' + purecookieDesc + ' ' + purecookieLink + '</p></div><div class="cookieButton"><a onClick="purecookieDismiss();">' + purecookieButton + '</a></div></div>';
	pureFadeIn("cookieConsentContainer");
  }
}

function purecookieDismiss() {
  setCookie('purecookieDismiss','1',7);
  pureFadeOut("cookieConsentContainer");
	then {
  		const element = document.getElementById("cookieConsentContainer");
  		element.remove()
	}
}

window.onload = function() { cookieConsent(); };


}
