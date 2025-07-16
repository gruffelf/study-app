taskContainer = document.getElementById("task-container");
timer = document.getElementById("timer");

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

  await loadTasks();

  var circle = new ProgressBar.Circle(timer, {
    color: "green",
    duration: 3000,
    easing: "easeInOut",
    strokeWidth: 9,
    text: {
      value: "25:13",
    },
  });

  circle.setText("Times up");
  circle.set(1);

  maxSeconds = 10;
  seconds = 0;

  timerInterval = setInterval(() => {
    circle.set(seconds / maxSeconds);
    circle.setText(`00:${maxSeconds - seconds}`);

    if (seconds >= maxSeconds) {
      circle.setText("Times up");
      clearInterval(timerInterval);
    }

    seconds += 1;
  }, 1000);
});
