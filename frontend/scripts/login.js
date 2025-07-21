const userField = document.getElementById("username");
const passField = document.getElementById("password");

const loginWarning = document.getElementById("login-warning");

// In case user access page while logged in, remove login to remove any issues
sessionStorage.removeItem("user");

// Creates a div above login with a custom message
function openLoginWarning(text, colour = null) {
  if (colour != null) {
    loginWarning.style.backgroundColor = colour;
  }
  loginWarning.innerHTML = text;
  loginWarning.classList.add("popup-warning-active");
}

// Closes login warning
function clearLoginWarning() {
  loginWarning.classList.remove("popup-warning-active");
  loginWarning.innerHTML = "";
  loginWarning.style.backgroundColor = "red";
}

function login() {
  if (userField.value == "" || passField.value == "") {
    openLoginWarning("Invalid Credentials");
    return;
  }

  get("login", JSON.stringify([userField.value, passField.value])).then(
    (data) => {
      data = JSON.parse(data);

      if (data["status"] == true) {
        openLoginWarning("Logged in as " + userField.value, "green");
        open(userField.value, data["access_token"]);
      } else {
        openLoginWarning("Invalid Credentials");
      }
    },
  );
}

function createAccount() {
  if (userField.value == "" || passField.value == "") {
    openLoginWarning("Invalid Credentials");
    return;
  }

  get("createAccount", JSON.stringify([userField.value, passField.value])).then(
    (data) => {
      data = JSON.parse(data);

      if (data["status"] == false) {
        openLoginWarning("Username taken");
      } else {
        openLoginWarning(
          "Account " + userField.value + " created, logging you in",
          "green",
        );
        open(userField.value, data["access_token"]);
      }
    },
  );
}

function open(user, token) {
  currentToken = token;
  currentUser = user;
  sessionStorage.setItem("token", token);
  setTimeout(() => {
    window.location.href = "todo.html";
  }, "500");
}
