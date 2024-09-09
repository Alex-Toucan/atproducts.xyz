// --- Config --- //
var pureAlert1Type = "alert-dark"; // Color
var pureAlert1Title = "DATA NOTICE:"; // Title
var pureAlert1Icon = 'bi-dash-lg'; // Icon
var pureAlert1Desc = "We have removed all unnecessary and/or unused files starting with 2.19.1. This results in 207 files being removed. If you are curious on what these files are, please click the link here:"; // Description
var pureAlert1Link = 'https://github.com/Alex-Toucan/atproducts.xyz/pull/220/commits/80b2ffed86602d040542bf7168f28056e7ddc801'; // Link
var pureAlert1LinkDesc = 'View the GitHub commit'; // Link text
var pureAlert1Enabled = false; // Switch to enable/disable alert
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
    if (pureAlert1Enabled && window.location.pathname.indexOf("/cctv") === -1 && !getAlert1Cookie('pureAlert1Dismiss')) {
        var header = $('header');
        var alert1Container = $('<div class="alert-container"></div>');
        alert1Container.html('<div class="alert ' + pureAlert1Type + ' alert-dismissible fade show mb-0 d-flex gap-2" role="alert"> <i class="bi ' + pureAlert1Icon + ' h-100"></i><div><strong>' + pureAlert1Title + '</strong> ' + pureAlert1Desc + ' <a class="icon-link icon-link-hover" href="' + pureAlert1Link + '">' + pureAlert1LinkDesc + '<i class="bi bi-arrow-right h-100"></i></a></div><button onclick="pureAlert1Dismiss();" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> </div>');
        header.after(alert1Container);
    }
});

function pureAlert1Dismiss() {
    setAlert1Cookie('pureAlert1Dismiss', '1', 7);
}
