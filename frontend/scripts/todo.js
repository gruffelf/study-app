dim = document.getElementById("dim-overlay");
taskEntry = document.getElementById("task-entry");

subjectList = document.getElementById("subjectlist");

studyList = document.getElementById("study-task-list");
assessList = document.getElementById("assess-task-list");

taskWarning = document.getElementById("task-warning");

taskName = document.getElementById("task-name");

currentSubject = "";

function openTask(i) {
  dim.style.display = "block";
  taskEntry.style.display = "flex";
  taskEntry.dataset.category = i;
}

function closeTask() {
  dim.style.display = "none";
  taskEntry.style.display = "none";
  taskName.value = "";
}

function saveTask() {
  if (currentUser == "") {
    openTaskWarning("Please log in");
    return;
  }

  dim.style.display = "none";
  taskEntry.style.display = "none";

  const name = taskName.value;
  let category;

  if (taskEntry.dataset.category == "study") {
    category = "study";
    addTask(name, "study");
  } else {
    category = "assess";
    addTask(name, "assess");
  }

  post("addtask", {
    user: currentUser,
    name: name,
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
function addTask(name, category) {
  taskHTML = `
    <div class="task" data-name="${name}" data-category="${category}">
      <input onclick="taskCheckbox(event)" class="task-checkbox" type="checkbox">
        ${name}
      <i class="fa fa-trash" onclick="deleteTask(event)"></i>
    </div>`;

  if (category == "study") {
    studyList.innerHTML += taskHTML;
  } else {
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
      addTask(value["name"], value["category"]);
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
  } else {
    subjectContainer.innerHTML += `<span onclick="changeSubject(event)">${name}</span>`;
  }
}

function changeSubject(e) {
  subjectContainer
    .querySelector(".subject-selected")
    .classList.remove("subject-selected");

  e.target.classList.add("subject-selected");

  currentSubject = e.target.innerHTML;
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

document.addEventListener("DOMContentLoaded", async function () {
  subjectlist.innerHTML +=
    "<p style='text-align: right; flex-grow: 5;'>Welcome " +
    currentUser +
    "</p>";

  subjectContainer = document.getElementById("subject-container");

  await loadSubjects();

  if (currentUser != "") {
    console.log(currentSubject);
    loadTasks();
  }
});
