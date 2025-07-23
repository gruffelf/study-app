// This script is used by index.html to deal with logging in and creating accounts

// Gets references to html elements
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

// Function that takes the entry fields and makes API request to see whether they are a valid user and pass combo
// Then calls open() function if successful, and creates error if not
function login() {
  // Error if any fields are left blank at all
  if (userField.value == "" || passField.value == "") {
    openLoginWarning("Invalid Credentials");
    return;
  }

  if (
    containsEscapable(userField.value) ||
    containsEscapable(passField.value)
  ) {
    openLoginWarning(`Invalid Characters Used (&, <, >, ", ' or /)`, "red");
    return;
  }

  // Sends user and pass, and recieve a validity status and a access token
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

// Creates an account with user and pass input fields,
function createAccount() {
  // Error if any fields are left blank at all
  if (userField.value == "" || passField.value == "") {
    openLoginWarning("Invalid Credentials");
    return;
  }

  if (
    containsEscapable(userField.value) ||
    containsEscapable(passField.value)
  ) {
    openLoginWarning(`Invalid Characters Used (&, <, >, ", ' or /)`, "red");
    return;
  }

  // Sends data to endpoint, if valid logs you in with open() and gives status message
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

// Called by login() and createAccount() once credentials are successful, and stores the access token to storage and redirects user to task page
// As well as creating global variables for token and user
function open(user, token) {
  currentToken = token;
  currentUser = user;
  sessionStorage.setItem("token", token);
  setTimeout(() => {
    window.location.href = "todo.html";
  }, "500");
}
