function Previous() {
  window.history.back()
}

var 404id = document.getElementById("404btn");

if (404id) {
  404id.addEventListener("click", Previous);
}
