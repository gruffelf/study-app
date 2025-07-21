// This is a script the runs on the calender page, creating functionality for dragging tasks onto weekdays and updating the database with weekdays

// Get references to html elements
dayHeadings = document.getElementsByClassName("day-heading");
weekContainer = document.getElementById("week-container");
taskContainer = document.getElementById("task-container");

// Runs whenever mouse scroll wheel is input, and moves the weekday container left and right or the document up and down
weekContainer.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
    if (e.deltaX > 0) weekContainer.scrollLeft += 20;
    else weekContainer.scrollLeft -= 20;
    if (e.deltaY > 0) window.scrollBy(0, 15);
    else window.scrollBy(0, -15);
  },
  { passive: false },
);

// Initlise variables globally
let mouseDown = false;
let startX;
let scrollLeft;

// These functions are for click and drag to scroll the weekday container

// When mouse is clicked on the weekday, initalise scroll with current position
weekContainer.addEventListener(
  "mousedown",
  function (e) {
    mouseDown = true;
    startX = e.pageX - weekContainer.offsetLeft;
    scrollLeft = weekContainer.scrollLeft;
  },
  false,
);

// End scroll when left click is released
weekContainer.addEventListener(
  "mouseup",
  function (e) {
    mouseDown = false;
  },
  false,
);

// Update scroll while mouse is moving and clicked down by how far mouse has moved
weekContainer.addEventListener(
  "mousemove",
  function (e) {
    e.preventDefault();
    if (!mouseDown) {
      return;
    }

    currentX = e.pageX - weekContainer.offsetLeft;
    scroll = currentX - startX;
    weekContainer.scrollLeft = scrollLeft - scroll;
  },
  false,
);

// Initalise variables to be used globally
let scrolling = null;
let currentPageX = null;

// These functions are for drag and drop functionality of tasks onto weekdays

// Run when dragging item over a weekday
function dragoverHandler(e) {
  e.preventDefault(); // Override default behaviour

  currentPageX = e.pageX; // Store current mouse value to be referenced in the interval
}

// Run when picking up an item
function dragstartHandler(e) {
  e.dataTransfer.setData("text", e.target.id); // Add id of task

  // Stop the scrolling interval to be run
  if (scrolling) {
    return;
  }

  // Repeatedly scroll page while dragging a task near the edges of the screen
  scrolling = setInterval(() => {
    if (currentPageX > window.innerWidth * 0.85) {
      weekContainer.scrollLeft += 30;
    }
    if (currentPageX < window.innerWidth * 0.15) {
      weekContainer.scrollLeft -= 30;
    }
  }, 32);
}

// When dropped into a weekday
function onDrop(e) {
  mouseDown = false; // Stop scrolling
  if (scrolling) {
    clearInterval(scrolling);
    scrolling = null;
  }

  e.preventDefault();

  // Get tasks reference that was dropped
  data = e.dataTransfer.getData("text");
  e.currentTarget.appendChild(document.getElementById(data));
  day = e.currentTarget.dataset.day;

  // Update the tasks weekday value in database
  post("edittask", {
    user: currentToken,
    id: data,
    feature: "day",
    value: day,
  });
}

// When dropped back into task bank (different function than to weekday)
function onReturnDrop(e) {
  mouseDown = false; // Stop scrolling
  if (scrolling) {
    clearInterval(scrolling);
    scrolling = null;
  }

  e.preventDefault();

  // Get reference to task
  data = e.dataTransfer.getData("text");
  e.target.appendChild(document.getElementById(data));

  // Remove weekday value from database
  post("edittask", {
    user: currentToken,
    id: data,
    feature: "day",
    value: null,
  });
}

// Function to add task to html used by loadTasks()
function addTask(name, category, description, date, subject, id, day) {
  // If task is a study tasks
  if (category == "study") {
    // Tasks display without due date
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}" draggable="true" ondragstart="dragstartHandler(event)">
        <div class="task-data">
            <span class="task-name">${name}</span>
            <span class="task-subject">From ${subject}</span>
        </div>
      </div>`;

    // If it has no weekday add it to task bank, otherwise add to corresponding week day
    if (day != undefined) {
      document
        .getElementById(`weekday-${day}`)
        .insertAdjacentHTML("beforeend", taskHTML);
    } else {
      taskContainer.innerHTML += taskHTML;
    }

    // Otherwise if it is an assessment task
  } else {
    // Task display with due date
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}" draggable="true" ondragstart="dragstartHandler(event)">
        <div class="task-data">
            <span class="task-name">Continue "${name}"</span>
            <span class="task-subject">From ${subject}</span>
            <span class="task-subject">Due in <span style="font-weight:bold">${Math.round((date - Date.now()) / 86400000)}</span> days</span>
        </div>
      </div>`;

    // If it has no weekday add it to task bank, otherwise add to corresponding week day
    if (day != undefined) {
      document
        .getElementById(`weekday-${day}`)
        .insertAdjacentHTML("beforeend", taskHTML);
    } else {
      taskContainer.innerHTML += taskHTML;
    }
  }
}

// Get request for currentToken's tasks from database, loops through each tasks and adds them
async function loadTasks() {
  get_header("tasks", JSON.stringify([0, "all"]), currentToken).then((data) => {
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

// Runs when page is loaded
document.addEventListener("DOMContentLoaded", async function () {
  //Array so each weekday name is a assigned a number, weekday[0] = Sunday assigns sunday the number 0.
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Loops through each weekday element and assigns it the corresponding weeday name, starting at today and going through each next day.
  for (let i = 0; i < dayHeadings.length; i++) {
    currentDay = new Date().getDay();
    console.log(currentDay + i);

    // If currentday is less than max act like normal, but onces its over that subtract 7 so it loops back to start of the week
    if (currentDay + i <= 6) {
      dayHeadings[i].innerHTML = weekday[currentDay + i];
      dayHeadings[i].parentElement.dataset.day = currentDay + i;
      dayHeadings[i].parentElement.id = `weekday-${currentDay + i}`;
    } else {
      dayHeadings[i].innerHTML = weekday[currentDay + i - 7];
      dayHeadings[i].parentElement.dataset.day = currentDay + i - 7;
      dayHeadings[i].parentElement.id = `weekday-${currentDay + i - 7}`;
    }
  }

  // Loads all tasks once page is loaded
  await loadTasks();
});
