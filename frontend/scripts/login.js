function openLogin() {
  dim.style.display = "block";
  loginPage.style.display = "flex";
  userField.value = "";
  passField.value = "";
}

function closeLogin() {
  dim.style.display = "none";
  loginPage.style.display = "none";
  clearLoginWarning();
}

function openLoginWarning(text, colour = null) {
  if (colour != null) {
    loginWarning.style.backgroundColor = colour;
  }
  loginWarning.innerHTML = text;
  loginWarning.classList.add("popup-warning-active");
}

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
