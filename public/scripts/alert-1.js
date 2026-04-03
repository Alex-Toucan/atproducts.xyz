// --- Config --- //
var pureAlert1Type = "alert-dark"; // Color
var pureAlert1Title = "2.25 BETA NOW FOR VIEWING:"; // Title
var pureAlert1Icon = 'bi-plus-lg'; // Icon
var pureAlert1Desc = "As we continue to develop our site to always become bigger and better, we are announcing the new version of the site that will shape the future of our platform: 2.25, which introduces Bootstrap v6. Public viewing is now available by clicking the link below."; // Description
var pureAlert1Link = 'https://beta-testing.atproducts.xyz/links/'; // Link
var pureAlert1LinkDesc = 'View more information'; // Link text
var pureAlert1Enabled = true; // Switch to enable/disable alert
// ---        --- //

function setAlert1Cookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000 * 4.28571428571));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getAlert1Cookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseAlert1Cookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

$(document).ready(function () {
    if (pureAlert1Enabled &&
        window.location.pathname.indexOf("/stories/") === -1 &&
        window.location.pathname.indexOf("/articles/") === -1 &&
        !getAlert1Cookie('pureAlert1Dismiss')) {
        
        var header = $('header');
        var alert1Container = $('<div class="alert-container"></div>');
        alert1Container.html('<div class="alert ' + pureAlert2Type + ' alert-dismissible fade show mb-0 d-flex gap-2 rounded-0" role="alert"> <i class="bi ' + pureAlert2Icon + ' h-100"></i><div><strong>' + pureAlert2Title + '</strong> ' + pureAlert2Desc + ' <a class="icon-link icon-link-hover" href="' + pureAlert2Link + '">' + pureAlert2LinkDesc + '<i class="bi bi-arrow-right h-100"></i></a></div><button onclick="pureAlert2Dismiss();" type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="none"><path fill="currentcolor" d="M12 0a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm-.646 4.646a.5.5 0 0 0-.707 0L8 7.293 5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.647a.5.5 0 1 0 .708.707L8 8.707l2.647 2.646a.5.5 0 1 0 .707-.707L8.707 8l2.646-2.646a.5.5 0 0 0 0-.708z"/></svg></button>');
        header.after(alert1Container);
    }
});

function pureAlert1Dismiss() {
    setAlert1Cookie('pureAlert1Dismiss', '1', 7);
}
