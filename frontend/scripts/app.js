const dev_url = "http://localhost:8000/"; //Local url
const api_url = dev_url; // Select which url to use

dim = document.getElementById("dim-overlay");

var currentToken = "";
var currentUser = "";

// Checks if current page is not the login page, and if so checks if user it not logged in, and if so will redirect to login page
if (
  window.location.pathname != "/" &&
  window.location.pathname.includes("index.html") == false
) {
  if (sessionStorage.getItem("token") == null) {
    window.location.href = "index.html";
  } else {
    currentToken = sessionStorage.getItem("token");
    get_header("verify-token", 0, currentToken).then((data) => {
      data = JSON.parse(data);
      if (data["status"] == "false") {
        window.location.href = "index.html";
      } else {
        currentUser = data["user"];
        document.dispatchEvent(new Event("userReady"));
      }
    });
  }
}

//get request template, parameters are api endpoint, and data to pass through
async function get(i, user) {
  const url = api_url + i;
  try {
    const response = await fetch(url + `/${user}`);
    if (!response.ok) {
      siteError();
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    siteError();
    throw new Error();
  }
}

async function get_header(i, user, token) {
  const url = api_url + i;
  try {
    const response = await fetch(url + `/${user}`, {
      headers: { token: token },
    });
    if (!response.ok) {
      siteError();
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    siteError();
    throw new Error();
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
    return result;
  } catch (error) {
    console.error("Error:", error);
    return result;
  }
}

// Function for logout button at top of navbar. Simply removes login info from cache and redirects to login page
function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
}

function siteError() {
  document.body.innerHTML = `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Study App</title>
        </head>
        <body>
            <h1>API Connection Error</h1>
            <p>Please check with server administrator and try again later</p>
        </body>
    </html>
    `;
}
