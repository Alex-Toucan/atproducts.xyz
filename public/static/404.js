function Previous() {
  window.history.back()
}

var fourofour = document.getElementById('404btn');

if(fourofour) {
  fourofour.addEventListener("click", Previous);
}
