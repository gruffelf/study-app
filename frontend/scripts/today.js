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

timerInterval = null;
circle = null;
maxSeconds = 10;
seconds = 0;
timerButton = document.getElementById("timer-button");

function timerTick() {
  circle.animate(seconds / maxSeconds);
  currentTime = maxSeconds - seconds;
  minutes = Math.floor(currentTime / 60);
  circle.setText(
    `${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${(currentTime - 60 * minutes).toLocaleString(undefined, { minimumIntegerDigits: 2 })}`,
  );
}

function stopTimer() {
  circle.stop();
  circle.set(1);
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  timerButton.textContent = "Start Session";
}

function startTimer(e) {
  if (!timerInterval) {
    timerButton.textContent = "Stop Session";
    circle.set(0);
    timerTick();
    timerInterval = setInterval(() => {
      timerTick();

      if (seconds > maxSeconds) {
        circle.setText("Times up");
        stopTimer();
      } else {
        seconds += 1;
      }
    }, 1000);
  } else {
    circle.setText("Ready to Study");
    stopTimer();
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  currentDay = new Date().getDay();

  loadTasks();

  circle = new ProgressBar.Circle(timer, {
    color: "green",
    duration: 1000,
    easing: "linear",
    strokeWidth: 9,
    text: {
      value: "Ready to Study",
    },
  });

  circle.set(1);
});
