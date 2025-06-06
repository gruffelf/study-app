const dev_url = "http://localhost:8000/"; //Local url
const api_url = dev_url; // Select which url to use

dim = document.getElementById("dim-overlay");
loginPage = document.getElementById("login-page");

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
}

function closeLogin() {
  dim.style.display = "none";
  loginPage.style.display = "none";
}
