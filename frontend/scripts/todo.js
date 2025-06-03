dim = document.getElementById("dim-overlay");
taskEntry = document.getElementById("task-entry");

function openTask() {
  dim.style.display = "block";
  taskEntry.style.display = "flex";
}

function saveTask() {
  dim.style.display = "none";
  taskEntry.style.display = "none";
}
