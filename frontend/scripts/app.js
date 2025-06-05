const subjectList = document.getElementById("subjectlist");

const dev_url = "http://localhost:8000/";
const api_url = dev_url;

async function get(i) {
  const url = api_url + i;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
  }
}

get("subjects").then((data) => {
  data = JSON.parse(data);
  console.log(data);
  subjectList.innerHTML = data[0].name;
});

//async function post(i, data) {
//  const url = api_url + i;
//  const response = await fetch(url, {
//    method: "POST",
//body: [data],
//});
//const result = await response.json();
//console.log(result);
//}
