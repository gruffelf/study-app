const dev_url = "http://localhost:8000/"; //Local url
const api_url = dev_url; // Select which url to use

dim = document.getElementById("dim-overlay");
const loginPage = document.getElementById("login-page");

const userField = document.getElementById("username");
const passField = document.getElementById("password");

const loginWarning = document.getElementById("login-warning");

var currentUser = "";

// Checks if current page is not the login page, and if so checks if user it not logged in, and if so will redirect to login page
if (
  window.location.pathname != "/" &&
  window.location.pathname.includes("index.html") == false
) {
  if (sessionStorage.getItem("user") == null) {
    window.location.href = "index.html";
  } else {
    currentUser = sessionStorage.getItem("user");
  }
}

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

// Post request template, uses fetch() to make a POST request with some headers and a body
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

// Function for logout button at top of navbar. Simply removes login info from cache and redirects to login page
function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
}
