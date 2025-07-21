taskContainer = document.getElementById("task-container");
timer = document.getElementById("timer");

function addTask(name, category, description, date, subject, id, day) {
  if (category == "study") {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}">
        <div class="task-data">
        <span><input onclick="taskCheckbox(event)" class="task-checkbox" type="checkbox" style="margin-right: 0.5rem"><span class="task-name">${name}</span></span>
            <span style="font-weight: normal; font-size: 0.9rem; font-style: italic">${description}</span>
            <span class="task-subject">From ${subject}</span>
        </div>
      </div>`;
    taskContainer.innerHTML += taskHTML;
  } else {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}">

        <div class="task-data">
            <span><input onclick="taskCheckbox(event)" class="task-checkbox" type="checkbox" style="margin-right: 0.5rem"><span class="task-name">Continue "${name}"</span></span>
            <span style="font-weight: normal; font-size: 0.9rem; font-style: italic">${description}</span>
            <span class="task-subject">From ${subject}</span>
            <span class="task-subject">Due in <span style="font-weight:bold">${Math.round((date - Date.now()) / 86400000)}</span> days</span>
        </div>
      </div>`;
    taskContainer.innerHTML += taskHTML;
  }
}

function taskCheckbox(e) {
  const task = e.target.closest(".task");

  if (e.target.checked == true) {
    task.style.backgroundColor = "lightgreen";
  } else {
    task.style.backgroundColor = "white";
  }
}

async function loadTasks() {
  get_header(
    "tasks",
    JSON.stringify([0, "all", currentDay]),
    currentToken,
  ).then((data) => {
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
  });
}

timerInterval = null;
circle = null;
maxSeconds = 10;
seconds = 0;
timerButton = document.getElementById("timer-button");
pauseButton = document.getElementById("pause-button");
times = ["study", "short", "study", "short", "study", "short", "study", "long"];
stages = document.getElementsByClassName("stage");
currentStage = 0;
timeLengths = { study: 25, short: 5, long: 30 };
firstClick = false;
isPaused = false;

function timerTick() {
  circle.animate(seconds / maxSeconds);
  currentTime = maxSeconds - seconds;
  minutes = Math.floor(currentTime / 60);
  circle.setText(
    `${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${(currentTime - 60 * minutes).toLocaleString(undefined, { minimumIntegerDigits: 2 })}`,
  );
}

function stopTimer() {
  pauseButton.classList.add("hide");
  circle.stop();
  circle.set(1);
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  timerButton.textContent = "Start Session";
}

function startTimer(e) {
  isPaused = false;
  pauseButton.classList.remove("hide");
  if (!timerInterval) {
    if (firstClick) {
      nextStage();
    } else {
      firstClick = true;
    }

    maxSeconds = timeLengths[times[currentStage]] * 60;
    timerButton.textContent = "Skip Session";
    circle.set(0);
    timerTick();
    timerInterval = setInterval(() => {
      timerTick();

      if (seconds > maxSeconds) {
        circle.setText("Times up. Ready to Continue?");
        stopTimer();
      } else {
        seconds += 1;
      }
    }, 1000);
  } else {
    circle.setText("Ready to Start");
    stopTimer();
    firstClick = false;
    nextStage();
  }
}

function pauseTimer(e) {
  if (isPaused) {
    isPaused = false;
    pauseButton.textContent = "Pause Timer";
    timerInterval = setInterval(() => {
      timerTick();

      if (seconds > maxSeconds) {
        circle.setText("Times up. Ready to Continue?");
        stopTimer();
      } else {
        seconds += 1;
      }
    }, 1000);
  } else {
    isPaused = true;
    pauseButton.textContent = "Resume Timer";
    clearInterval(timerInterval);
  }
}

stageClasses = { study: "studying", short: "shorting", long: "longing" };

function nextStage() {
  stages[currentStage].classList.forEach(function (i) {
    if (i in stageClasses) {
      stages[currentStage].classList.remove(stageClasses[i]);
      return;
    }
  });
  currentStage += 1;
  if (currentStage >= 8) {
    currentStage = 0;
  }

  stages[currentStage].classList.forEach(function (i) {
    if (i in stageClasses) {
      stages[currentStage].classList.add(stageClasses[i]);
      currentColor = getComputedStyle(stages[currentStage]).backgroundColor;
      circle.path.setAttribute("stroke", currentColor);
      circle.text.style.color = currentColor;
      return;
    }
  });
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
      value: "Ready to Start",
    },
  });

  circle.set(1);
});
