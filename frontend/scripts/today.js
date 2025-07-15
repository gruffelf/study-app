taskContainer = document.getElementById("task-container");

function addTask(name, category, description, date, subject, id, day) {
  if (category == "study") {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}">
        <div class="task-data">
            <span class="task-name">${name}</span>
            <span class="task-subject">From ${subject}</span>
        </div>
      </div>`;
    taskContainer.innerHTML += taskHTML;
  } else {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}">
        <div class="task-data">
            <span class="task-name">Continue "${name}"</span>
            <span class="task-subject">From ${subject}</span>
            <span class="task-subject">Due in <span style="font-weight:bold">${Math.round((date - Date.now()) / 86400000)}</span> days</span>
        </div>
      </div>`;
    taskContainer.innerHTML += taskHTML;
  }
}

async function loadTasks() {
  get("tasks", JSON.stringify([currentUser, "all", currentDay])).then(
    (data) => {
      data = JSON.parse(data);

      data.forEach((value) => {
        addTask(
          value["name"],
          value["category"],
          value["description"],
          new Date(value["date"]),
          value["subject"],
          value["id"],
          value["day"],
        );
      });
    },
  );
}

document.addEventListener("DOMContentLoaded", async function () {
  currentDay = new Date().getDay();

  loadTasks();
});
