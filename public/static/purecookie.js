// --- Config --- //
var purecookieTitle = "Cookies."; // Title
var purecookieIcon = '<i class="bi bi-cookie me-2"></i>' // Cookie icon
var purecookieDesc = "By using this website, you automatically accept that we use cookies."; // Description
var purecookieLink = '<a href="/privacy#cookies" target="_blank" rel="noopener noreferrer">Why?</a>'; // Cookiepolicy link
var purecookieButton = "Understood"; // Button text
// ---        --- //

function pureFadeIn(elem, display){
  $("#" + elem).css({opacity: 0, display: display || "block"}).animate({opacity: 1}, 500);
}
	
function pureFadeOut(elem){
  $("#" + elem).animate({opacity: 0}, 500, function(){
    $(this).css("display", "none").delay(1350).queue(function(){
      $(this).remove().dequeue();
    });
  });
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000*4.285));
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

$(document).ready(function() {
  if (!getCookie('purecookieDismiss')) {
    $('div#page').append('<div class="cookieConsentContainer" id="cookieConsentContainer"><div class="cookieTitle"><span>' + purecookieIcon + '' + purecookieTitle + '</span></div><div class="cookieDesc"><p>' + purecookieDesc + ' ' + purecookieLink + '</p></div><div class="cookieButton"><button onClick="purecookieDismiss();">' + purecookieButton + '</button></div></div>');
    pureFadeIn("cookieConsentContainer");
  }
});

function purecookieDismiss() {
  setCookie('purecookieDismiss','1',7);
  pureFadeOut("cookieConsentContainer");
}
