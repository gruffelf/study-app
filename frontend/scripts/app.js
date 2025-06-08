const dev_url = "http://localhost:8000/"; //Local url
const api_url = dev_url; // Select which url to use

dim = document.getElementById("dim-overlay");
const loginPage = document.getElementById("login-page");

const userField = document.getElementById("username");
const passField = document.getElementById("password");

const loginWarning = document.getElementById("login-warning");

var currentUser = "";

//get request template, parameters are api endpoint, and data to pass through
async function get(i, user) {
  const url = api_url + i;
  try {
    const response = await fetch(url + `/${user}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
  }
}

async function post(i, data) {
  const url = api_url + i;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

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
      console.log(data);

      if (data["status"] == true) {
        currentUser = userField.value;
        openLoginWarning("Logged in as " + userField.value, "green");
        loadTasks();
      } else {
        openLoginWarning("Invalid Credentials");
      }
    },
  );
}
