const dev_url = "http://localhost:8000/"; //Local url
const api_url = dev_url; // Select which url to use

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

//async function post(i, data) {
//  const url = api_url + i;
//  const response = await fetch(url, {
//    method: "POST",
//body: [data],
//});
//const result = await response.json();
//console.log(result);
//}
