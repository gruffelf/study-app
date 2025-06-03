dim = document.getElementById("dim-overlay");
taskEntry = document.getElementById("task-entry");

studyList = document.getElementById("study-task-list");
assessList = document.getElementById("assess-task-list");

taskName = document.getElementById("task-name");

taskHTML = `<div class='task'>- ${taskName.value}</div>`

function openTask() {
  dim.style.display = "block";
  taskEntry.style.display = "flex";
}

function saveTask() {
  dim.style.display = "none";
  taskEntry.style.display = "none";

  studyList.innerHTML += taskHTML;

}
