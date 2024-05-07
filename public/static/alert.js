// --- Config --- //
var pureAlertTitle = "NEW BETA TESTING SITE:"; // Title
var pureAlertIcon = '<i class="bi bi-plus-lg h-100"></i>' // Cookie icon
var pureAlertDesc = "We have updated the Department of Beta Testing site to be more modernized with Bootstrap 5 and Astro!"; // Description
var pureAlertLink = 'https://beta-testing.atproducts.xyz'; // Cookiepolicy link
var pureAlertLinkDesc = 'View Now'; // Cookiepolicy link
var pureAlertButton = "Understood"; // Button text
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

function setAlertCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getAlertCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseAlertCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

/* Comment this section if there is no alert loaded */
document.addEventListener('DOMContentLoaded', () => {
  if (!getAlertCookie('pureAlertDismiss')) {
    document.querySelector('header').innerHTML += 
'<div class="alert alert-dark alert-dismissible fade show mb-0 d-flex gap-2" role="alert">' + pureAlertIcon + '<div><strong>' + pureAlertTitle + '</strong> ' + pureAlertDesc + ' <a class="icon-link icon-link-hover" href="' + pureAlertLink + '">' + pureAlertLinkDesc + '<i class="bi bi-arrow-right h-100"></i></a></div><button onclick="purecookieDismiss();" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> </div>';
    pureFadeIn("alertContentContainer");
  }
});

function pureAlertDismiss() {
  setAlertCookie('pureAlertDismiss','1',7);
  pureFadeOut("alertContentContainer");
}
