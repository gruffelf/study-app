dim = document.getElementById("dim-overlay");
taskEntry = document.getElementById("task-entry");

subjectlist.innerHTML +=
  "<p style='text-align: right; flex-grow: 5;'>Welcome " + currentUser + "</p>";

subjectList = document.getElementById("subjectlist");
subjectEntry = document.getElementById("subject-entry");
subjectName = document.getElementById("subject-name");
subjectDisplay = document.getElementById("subject-display");
subjectWarning = document.getElementById("subject-warning");

subjectContainer = document.getElementById("subject-container");

studyList = document.getElementById("study-task-list");
assessList = document.getElementById("assess-task-list");

taskWarning = document.getElementById("task-warning");

taskName = document.getElementById("task-name");
taskDescription = document.getElementById("task-description");
taskDate = document.getElementById("task-date");
taskDateContainer = document.getElementById("due-date");

currentSubject = "";

function openTask(i) {
  if (i == "study") {
    taskDate.valueAsDate = null;
    taskDateContainer.style.display = "none";
  } else {
    taskDate.valueAsDate = new Date();
    taskDateContainer.style.display = "block";
  }

  dim.style.display = "block";
  taskEntry.style.display = "flex";
  taskEntry.dataset.category = i;
}

function closeTask() {
  dim.style.display = "none";
  taskEntry.style.display = "none";
  taskName.value = "";
  taskDescription.value = "";
}

function saveTask() {
  if (currentUser == "") {
    openTaskWarning("Please log in");
    return;
  }

  dim.style.display = "none";
  taskEntry.style.display = "none";

  const name = taskName.value;
  description = taskDescription.value;
  let category;

  if (taskEntry.dataset.category == "study") {
    category = "study";
    date = null;
    addTask(name, "study", description, date);
  } else {
    category = "assess";
    date = taskDate.valueAsDate;
    addTask(name, "assess", description, date);
  }

  post("addtask", {
    user: currentUser,
    name: name,
    description: description,
    date: date,
    category: category,
    subject: currentSubject,
  });

  taskName.value = "";
}

function taskCheckbox(e) {
  const task = e.target.closest(".task");

  if (e.target.checked == true) {
    task.style.backgroundColor = "lightgreen";
  } else {
    task.style.backgroundColor = "white";
  }
}

function deleteTask(e) {
  const task = e.target.closest(".task");
  post("deltask", { user: "gruffelf", name: task.dataset.name });
  task.remove();
}

// Gets a task name, and adds the tasks to the page
function addTask(name, category, description, date) {
  if (category == "study") {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}">
        <input onclick="taskCheckbox(event)" class="task-checkbox" type="checkbox">
        <div class="task-data">
            <span class="task-name">${name}</span>
            <span class="task-description">${description}</span>
        </div>
        <i class="fa fa-trash" onclick="deleteTask(event)"></i>
      </div>`;
    studyList.innerHTML += taskHTML;
  } else {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}">
        <input onclick="taskCheckbox(event)" class="task-checkbox" type="checkbox">
        <div class="task-data">
            <span class="task-name">${name}</span>
            <span class="task-description">${description}</span>
            <span class="task-due-date">Due: ${date.toLocaleString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        <i class="fa fa-trash" onclick="deleteTask(event)"></i>
      </div>`;
    assessList.innerHTML += taskHTML;
  }
}

// Get request for currentUser's tasks from database, loops through each tasks and adds them
function loadTasks() {
  studyList.innerHTML = "";
  assessList.innerHTML = "";
  console.log(currentSubject);
  get("tasks", JSON.stringify([currentUser, currentSubject])).then((data) => {
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

function openTaskWarning(text) {
  taskWarning.innerHTML = text;
  taskWarning.classList.add("popup-warning-active");
}

function clearTaskWarning() {
  taskWarning.classList.remove("popup-warning-active");
  taskWarning.innerHTML = "";
}

function addSubject(name, first = false) {
  if (first && currentSubject == "") {
    subjectContainer.innerHTML += `<span onclick="changeSubject(event)" class="subject-selected">${name}</span>`;
    currentSubject = name;
    subjectDisplay.innerHTML = currentSubject;
  } else {
    subjectContainer.innerHTML += `<span onclick="changeSubject(event)">${name}</span>`;
  }
}

function changeSubject(e) {
  try {
    subjectContainer
      .querySelector(".subject-selected")
      .classList.remove("subject-selected");
  } catch {
    let a;
  }

  e.target.classList.add("subject-selected");

  currentSubject = e.target.innerHTML;

  subjectDisplay.innerHTML = currentSubject;

  console.log(currentSubject);
  loadTasks();
}

async function loadSubjects() {
  subjectContainer.innerHTML = "";

  await get("subjects", currentUser).then((data) => {
    data = JSON.parse(data);

    data.forEach((value) => {
      if (value == data[0]) {
        addSubject(value, true);
      } else {
        addSubject(value);
      }
    });
  });
}

function openSubject() {
  dim.style.display = "block";
  subjectEntry.style.display = "flex";
}

function closeSubject() {
  clearSubjectWarning();
  dim.style.display = "none";
  subjectEntry.style.display = "none";
  subjectName.value = "";
}

function openSubjectWarning(text) {
  subjectWarning.innerHTML = text;
  subjectWarning.classList.add("popup-warning-active");
}

function clearSubjectWarning() {
  subjectWarning.classList.remove("popup-warning-active");
  subjectWarning.innerHTML = "";
}

async function createSubject() {
  clearSubjectWarning();

  result = await post("addsubject", {
    user: currentUser,
    subject: subjectName.value,
  });

  if (result["error"] != null) {
    openSubjectWarning(result["error"]);
  } else {
    addSubject(subjectName.value);
    closeSubject();
    changeSubject({ target: subjectContainer.lastChild });
  }
}

async function deleteSubject() {
  result = await post("delsubject", {
    user: currentUser,
    subject: currentSubject,
  });

  if (result["error"] != null) {
    console.log(result["error"]);
  } else {
    subjectContainer.querySelector(".subject-selected").remove();
    changeSubject({ target: subjectContainer.children[0] });
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadSubjects();

  if (currentUser != "") {
    console.log(currentSubject);
    loadTasks();
  }
});
