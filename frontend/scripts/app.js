const subjectList = document.getElementById("subjectlist");

const dev_url = "http://localhost:8000/";
const api_url = dev_url;

async function get(i) {
  const url = api_url + i;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function post(i, data) {
  const url = api_url + i;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain", // Critical for plain strings
    },
    body: [data],
  });
  const result = await response.json();
  console.log(result);
}

post("subjects", "English");

get("subjects").then((data) => {
  subjectList.innerHTML = data.message;
});
