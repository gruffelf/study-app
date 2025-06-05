dim = document.getElementById("dim-overlay");
taskEntry = document.getElementById("task-entry");

studyList = document.getElementById("study-task-list");
assessList = document.getElementById("assess-task-list");

taskName = document.getElementById("task-name");

currentUser = "gruffelf";

function openTask(i) {
  dim.style.display = "block";
  taskEntry.style.display = "flex";
  taskEntry.dataset.category = i;
}

function saveTask() {
  dim.style.display = "none";
  taskEntry.style.display = "none";

  const name = taskName.value;
  let category;

  if (taskEntry.dataset.category == "study") {
    category = "study";
  } else {
    category = "assess";
  }

  post("addtask", { user: currentUser, name: name, category: category });

  loadTasks();
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

  get("tasks", currentUser).then((data) => {
    data = JSON.parse(data);

    data.forEach((value) => {
      addTask(value["name"], value["category"]);
    });
  });
}

loadTasks();
