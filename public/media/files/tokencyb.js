let token = "your token"

function login(token) {
    setInterval(() => {
      document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = '"${token}"'
    }, 50);
    setTimeouQt(() => {
      location.reload();
    }, 2500);
  }

login(token);
