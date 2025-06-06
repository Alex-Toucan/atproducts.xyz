// --- Config --- //
var pureAlert2Type = "alert-dark"; // Color
var pureAlert2Title = "A Message from the Owner:"; // Title
var pureAlert2Icon = 'bi-exclamation-triangle-fill'; // Icon
var pureAlert2Desc = "AT Products LLC will be temporarily unavailable due to a personal situation involving myself, the owner. My mental health has been affected by a recent breakup; some of you may understand how difficult that can be. The next chapter of my life will be bigger and better. A new update is coming soon with the website, and Mine Falls (a Minecraft world). Thank you for your patience and understanding during this challenging time. I do not currently know how long I will be unavailable, but it may be a while. Again, thank you, for viewing and exploring the website. Shall I grow stronger as a person, and shall we grow stronger as a company!"; // Description
var pureAlert2Link = '/media/files/final.txt'; // Link
var pureAlert2LinkDesc = 'Read the other version of this message.'; // Link text
var pureAlert2Enabled = false; // Switch to enable/disable alert
// ---        --- //

function setAlert2Cookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000 * 4.28571428571));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getAlert2Cookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseAlert2Cookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

/* Comment this section if there is no alert loaded */
$(document).ready(function () {
    if (pureAlert2Enabled && window.location.pathname.indexOf("/stories/") === -1 && !getAlert2Cookie('pureAlert2Dismiss')) {
        var header = $('header');
        var alert2Container = $('<div class="alert-container"></div>');
        alert2Container.html('<div class="alert ' + pureAlert2Type + ' alert-dismissible fade show mb-0 d-flex gap-2" role="alert"> <i class="bi ' + pureAlert2Icon + ' h-100"></i><div><strong>' + pureAlert2Title + '</strong> ' + pureAlert2Desc + ' <a class="icon-link icon-link-hover" href="' + pureAlert2Link + '">' + pureAlert2LinkDesc + '<i class="bi bi-arrow-right h-100"></i></a></div><button onclick="pureAlert2Dismiss();" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> </div>');
        header.after(alert2Container);
    }
});

function pureAlert2Dismiss() {
    setAlert2Cookie('pureAlert2Dismiss', '1', 7);
}
