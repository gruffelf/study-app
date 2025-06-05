dim = document.getElementById("dim-overlay");
taskEntry = document.getElementById("task-entry");

studyList = document.getElementById("study-task-list");
assessList = document.getElementById("assess-task-list");

taskName = document.getElementById("task-name");

function openTask(i) {
  dim.style.display = "block";
  taskEntry.style.display = "flex";
  taskEntry.dataset.category = i;
}

function saveTask() {
  dim.style.display = "none";
  taskEntry.style.display = "none";

  taskHTML = `
    <div class="task">
      <input onclick="taskCheckbox(event)" class="task-checkbox" type="checkbox">
        ${taskName.value}
      <i class="fa fa-trash" onclick="deleteTask(event)"></i>
    </div>`;

  if (taskEntry.dataset.category == "study") {
    studyList.innerHTML += taskHTML;
  } else {
    assessList.innerHTML += taskHTML;
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

function deleteTask(e) {
  const task = e.target.closest(".task");
  task.remove();
}
