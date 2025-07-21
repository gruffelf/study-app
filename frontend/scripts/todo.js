// This script is run for the todo page, where you add, edit or delete tasks and subjects

// Establish references to html elements
dim = document.getElementById("dim-overlay");
taskEntry = document.getElementById("task-entry");

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

// Establish variable globally
currentSubject = "";

// Once app.js has got currentUser from the token
document.addEventListener("userReady", () => {
  //Add current user welcome message to subject bar
  subjectlist.innerHTML +=
    "<p style='text-align: right; flex-grow: 5;'>Welcome " +
    currentUser +
    "</p>";

  // Reestablish reference after changing DOM
  subjectContainer = document.getElementById("subject-container");
});

// Runs when add task/edit tasks dialogue is opened.
function openTask(i, newTask, id = null) {
  // Checks variable passed to task to see whether it is a new task or edit task action
  if (newTask) {
    // Change sumbit button onclick function to new task
    document
      .getElementById("submit-button")
      .setAttribute(onclick, "saveTask()");
  } else {
    // Change sumbit button onclick function to edit task and pass task id
    document
      .getElementById("submit-button")
      .setAttribute("onclick", `saveEditTask("${id}")`);
  }

  // If task is study tasks dont have due date, if its assessment tasks do have due date field
  if (i == "study") {
    taskDate.valueAsDate = null;
    taskDateContainer.style.display = "none";
  } else {
    taskDate.valueAsDate = new Date();
    taskDateContainer.style.display = "block";
  }

  // Display task entry field and dim background
  dim.style.display = "block";
  taskEntry.style.display = "flex";
  taskEntry.dataset.category = i;
}

// Function to close task popup when pressing X or submitting, resetting all fields and hiding them
function closeTask() {
  dim.style.display = "none";
  taskEntry.style.display = "none";
  taskName.value = "";
  taskDescription.value = "";
  taskDate.value = "";
}

// Function to add new task to database, and call addTask to add it to DOM
// Called from add task button
function saveTask() {
  // Get values from input fields
  const name = taskName.value;
  description = taskDescription.value;
  let category;
  id = crypto.randomUUID(); // Generate unique id for each task

  // Sets category depending on whether task was created for study or assessement
  if (taskEntry.dataset.category == "study") {
    category = "study";
    date = null;
    addTask(name, "study", description, date, id);
  } else {
    category = "assess";
    date = taskDate.valueAsDate;
    addTask(name, "assess", description, date, id);
  }

  // Adds task to database
  post("addtask", {
    user: currentToken,
    name: name,
    description: description,
    date: date,
    category: category,
    subject: currentSubject,
    id: id,
  });

  // Closes popup and resets fields
  closeTask();
}

// When delete button is pressed, gets task element and removes it from DOM and from database
function deleteTask(e) {
  const task = e.target.closest(".task");
  post("deltask", { user: "gruffelf", id: task.dataset.id });
  task.remove();
}

// Gets a task name, and adds the tasks to the page DOM, called from loadTasks and saveTask
function addTask(name, category, description, date, id) {
  if (category == "study") {
    // Tasks display without due date
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}">
        <div class="task-data">
            <span class="task-name">${name}</span>
            <span class="task-description">${description}</span>
        </div>
        <i class="fa fa-pencil" onclick="editTask(event)"></i>
        <i class="fa fa-trash" onclick="deleteTask(event)"></i>
      </div>`;
    studyList.innerHTML += taskHTML;
  } else {
    // Task display with due date, and formatted date string
    taskHTML = `
      <div class="task" data-date="${date.toISOString().split("T")[0]}" data-name="${name}" data-category="${category}" data-id="${id}">
        <div class="task-data">
            <span class="task-name">${name}</span>
            <span class="task-description">${description}</span>
            <span class="task-due-date">Due: ${date.toLocaleString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        <i class="fa fa-pencil" onclick="editTask(event)"></i>
        <i class="fa fa-trash" onclick="deleteTask(event)"></i>
      </div>`;
    assessList.innerHTML += taskHTML;
  }
}

//Temp variable to be used across functions
taskTemp = "";

// Runs when edit button is clicked, saves reference to tasks in taskTemp,
// Called openTask to be editting
// And sets userfield inputs to be prefilled with the tasks information
function editTask(e) {
  taskTemp = e.target.closest(".task");
  description = taskTemp.querySelector(".task-description").innerHTML;
  openTask(taskTemp.dataset.category, false, taskTemp.dataset.id, taskTemp);
  taskName.value = taskTemp.dataset.name;
  taskDescription.value = description;
  if (taskTemp.dataset.category == "assess") {
    console.log(taskTemp.dataset.date);
    taskDate.value = taskTemp.dataset.date;
  }
}

// Runs when save task is pressed in edit task dialogue
// resets the tasks outerHTML with new values
function saveEditTask(id) {
  // Checks if tasks was study or assessment task
  if (taskTemp.dataset.category == "study") {
    // Tasks display without due date
    taskTemp.outerHTML = `
      <div class="task" data-name="${taskName.value}" data-category="${taskTemp.dataset.category}" data-id="${id}">
        <div class="task-data">
            <span class="task-name">${taskName.value}</span>
            <span class="task-description">${taskDescription.value}</span>
        </div>
        <i class="fa fa-pencil" onclick="editTask(event)"></i>
        <i class="fa fa-trash" onclick="deleteTask(event)"></i>
      </div>`;
  } else {
    // Tasks display with due date and formatted date string
    taskTemp.outerHTML = `
      <div class="task" data-date="${taskDate.valueAsDate.toISOString().split("T")[0]}" data-name="${taskName.value}" data-category="${taskTemp.dataset.category}" data-id="${id}">
        <div class="task-data">
            <span class="task-name">${taskName.value}</span>
            <span class="task-description">${taskDescription.value}</span>
            <span class="task-due-date">Due: ${taskDate.valueAsDate.toLocaleString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        <i class="fa fa-pencil" onclick="editTask(event)"></i>
        <i class="fa fa-trash" onclick="deleteTask(event)"></i>
      </div>`;
  }

  // Endpoint to update a specific entry in tasks list with new information
  post("edittask", {
    user: currentToken,
    id: id,
    feature: "all",
    name: taskName.value,
    description: taskDescription.value,
    date: taskDate.value,
  });

  // Close edit popup and reset values
  closeTask();
}

// Get request for currentToken's tasks from database, loops through each tasks and adds them
function loadTasks() {
  studyList.innerHTML = "";
  assessList.innerHTML = "";
  console.log(currentSubject);
  get_header("tasks", JSON.stringify([0, currentSubject]), currentToken).then(
    (data) => {
      data = JSON.parse(data);
      console.log(data);

      data.forEach((value) => {
        addTask(
          value["name"],
          value["category"],
          value["description"],
          new Date(value["date"]),
          value["id"],
        );
      });
    },
  );
}

// Makes a error popup visible with custom text
function openTaskWarning(text) {
  taskWarning.innerHTML = text;
  taskWarning.classList.add("popup-warning-active");
}

// Wipes custom text and hides popup
function clearTaskWarning() {
  taskWarning.classList.remove("popup-warning-active");
  taskWarning.innerHTML = "";
}

// Adds a new subject into the DOM in the subject bar.
// If it is the first subject that exists (typically default) and no current subject is selected, it will set it to current subject
// If not just adds it to the end
function addSubject(name, first = false) {
  if (first && currentSubject == "") {
    subjectContainer.innerHTML += `<span onclick="changeSubject(event)" class="subject-selected">${name}</span>`;
    currentSubject = name;
    subjectDisplay.innerHTML = currentSubject;
  } else {
    subjectContainer.innerHTML += `<span onclick="changeSubject(event)">${name}</span>`;
  }
}

// Runs when subject is clicked, removes current subject class from prior subject and adds current subject to new subject
// Updates subject display element, and loads new tasks
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

// Runs when page is loaded and gets list of subjects from database, adding them to the DOM with addSubject() for each of them
async function loadSubjects() {
  subjectContainer.innerHTML = "";

  await get_header("subjects", 0, currentToken).then((data) => {
    data = JSON.parse(data);
    console.log(data);
    data.forEach((value) => {
      if (value == data[0]) {
        addSubject(value, true);
      } else {
        addSubject(value);
      }
    });
  });
}

// Opens the add subject dialogue box when button is pressed
function openSubject() {
  dim.style.display = "block";
  subjectEntry.style.display = "flex";
}

// Resets and closes add subject dialogue when close button is pressed or its submitted
function closeSubject() {
  clearSubjectWarning();
  dim.style.display = "none";
  subjectEntry.style.display = "none";
  subjectName.value = "";
}

// Opens warning popup with custom text
function openSubjectWarning(text) {
  subjectWarning.innerHTML = text;
  subjectWarning.classList.add("popup-warning-active");
}

// Closes warning popup and clears custom text
function clearSubjectWarning() {
  subjectWarning.classList.remove("popup-warning-active");
  subjectWarning.innerHTML = "";
}

// Runs when submit is pressed in new subject dialogue, posts it to the database and recieves response
// If response is bad it creates error message, if not it adds it to the database and DOM and changes subejct to it
async function createSubject() {
  clearSubjectWarning();

  result = await post("addsubject", {
    user: currentToken,
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

// Runs when delete icon is pressed next to subject, calls API to remove it from the database and delete all its tasks
// Also removes it from DOM and updates current subject to the first one
async function deleteSubject() {
  result = await post("delsubject", {
    user: currentToken,
    subject: currentSubject,
  });

  if (result["error"] != null) {
    console.log(result["error"]);
  } else {
    subjectContainer.querySelector(".subject-selected").remove();
    changeSubject({ target: subjectContainer.children[0] });
  }
}

// Runs when page is loaded, getting subjects and tasks
document.addEventListener("DOMContentLoaded", async function () {
  await loadSubjects();

  if (currentToken != "") {
    console.log(currentSubject);
    loadTasks();
  }
});
