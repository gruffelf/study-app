dayHeadings = document.getElementsByClassName("day-heading");
weekContainer = document.getElementById("week-container");
taskContainer = document.getElementById("task-container");

weekContainer.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
    if (e.deltaY > 0) weekContainer.scrollLeft += 100;
    else weekContainer.scrollLeft -= 100;
  },
  { passive: false },
);

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

for (let i = 0; i < dayHeadings.length; i++) {
  currentDay = new Date().getDay();
  console.log(currentDay + i);
  if (currentDay + i <= 6) {
    dayHeadings[i].innerHTML = weekday[currentDay + i];
  } else {
    dayHeadings[i].innerHTML = weekday[currentDay + i - 7];
  }
}

function addTask(name, category, description, date) {
  if (category == "study") {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}">

        <div class="task-data">
            <span class="task-name">${name}</span>

        </div>

      </div>`;
    taskContainer.innerHTML += taskHTML;
  } else {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}">

        <div class="task-data">
            <span class="task-name">Continue "${name}"</span>
        </div>

      </div>`;
    taskContainer.innerHTML += taskHTML;
  }
}

// Get request for currentUser's tasks from database, loops through each tasks and adds them
function loadTasks() {
  get("tasks", JSON.stringify([currentUser, "all"])).then((data) => {
    data = JSON.parse(data);
    console.log(data);

    data.forEach((value) => {
      addTask(
        value["name"],
        value["category"],
        value["description"],
        new Date(value["date"]),
      );
    });
  });
}

loadTasks();
