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
        currentUser = userField.value;
        openLoginWarning("Logged in as " + userField.value, "green");
        sessionStorage.setItem("user", userField.value);
        setTimeout(() => {
          window.location.href = "todo.html";
        }, "500");
      } else {
        openLoginWarning("Invalid Credentials");
      }
    },
  );
}

function createAccout() {}
