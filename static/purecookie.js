// --- Config --- //
var purecookieTitle = "Cookies."; // Title
var purecookieDesc = "By using this website, you automatically accept that we use cookies."; // Description
var purecookieLink = '<a href="/privacy#cookies" target="_blank" rel="noopener noreferrer">Why?</a>'; // Cookiepolicy link
var purecookieButton = "Understood"; // Button text
// ---        --- //

function pureFadeIn(elem, display) {
  var el = document.getElementById(elem);
  el.style.opacity = 0;
  el.style.display = display || "block";

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.style.opacity = 1; // If reduced motion, show element instantly without animation
  } else {
    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += 0.02) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
};

function pureFadeOut(elem) {
  var el = document.getElementById(elem);
  el.style.opacity = 1;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.style.display = "none"; // If reduced motion, hide element instantly without animation
  } else {
    (function fade() {
      if ((el.style.opacity -= 0.02) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
      setTimeout(() => {
        var theelement = document.querySelector('#cookieConsentContainer');
        if (theelement) {
          theelement.remove();
        };
      }, 1350);
    })();
  }
};

function setCookie(name, value, days) {
  // ... (your existing setCookie function)
}

function getCookie(name) {
  // ... (your existing getCookie function)
}

function eraseCookie(name) {
  // ... (your existing eraseCookie function)
}

window.addEventListener('load', function cookieConsent() { // Fix typo 'loaded' -> 'load'
  if (!getCookie('purecookieDismiss')) {
    document.querySelector('div#page').innerHTML += '<div class="cookieConsentContainer" id="cookieConsentContainer"><div class="cookieTitle"><span>' + purecookieTitle + '</span></div><div class="cookieDesc"><p>' + purecookieDesc + ' ' + purecookieLink + '</p></div><div class="cookieButton"><button onClick="purecookieDismiss();">' + purecookieButton + '</button></div></div>';
    pureFadeIn("cookieConsentContainer");
  }
});

function purecookieDismiss() {
  setCookie('purecookieDismiss', '1', 7);
  pureFadeOut("cookieConsentContainer");
}
