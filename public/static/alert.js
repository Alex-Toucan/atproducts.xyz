// --- Config --- //
var pureAlertType = "alert-dark"; // Color
var pureAlertTitle = "NEW BETA TESTING SITE:"; // Title
var pureAlertIcon = 'bi-plus-lg' // Icon
var pureAlertDesc = "We have updated the Department of Beta Testing site to be more modernized with Bootstrap 5 and Astro!"; // Description
var pureAlertLink = 'https://beta-testing.atproducts.xyz'; // Link
var pureAlertLinkDesc = 'View now'; // Link text
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
  // Check if current page is not "cctv"
  if (window.location.pathname.indexOf("/cctv") === -1 && !getAlertCookie('pureAlertDismiss')) {
    var header = document.querySelector('header');
    var alertContainer = document.createElement('div');
    alertContainer.className = "alert-container";
    alertContainer.innerHTML = '<div class="alert' + pureAlertType + 'alert-dismissible fade show mb-0 d-flex gap-2" role="alert"> <i class="bi ' + pureAlertIcon + ' h-100"></i><div><strong>' + pureAlertTitle + '</strong> ' + pureAlertDesc + ' <a class="icon-link icon-link-hover" href="' + pureAlertLink + '">' + pureAlertLinkDesc + '<i class="bi bi-arrow-right h-100"></i></a></div><button onclick="pureAlertDismiss();" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> </div>';
    pureFadeIn("alert-container");
      
    // Insert after header
    header.parentNode.insertBefore(alertContainer, header.nextSibling);
  }
});

function pureAlertDismiss() {
  setAlertCookie('pureAlertDismiss','1',7);
}
