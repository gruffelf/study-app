dayHeadings = document.getElementsByClassName("day-heading");
weekContainer = document.getElementById("week-container");
taskContainer = document.getElementById("task-container");

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

let mouseDown = false;
let startX;
let scrollLeft;

weekContainer.addEventListener(
  "mousedown",
  function (e) {
    mouseDown = true;
    startX = e.pageX - weekContainer.offsetLeft;
    scrollLeft = weekContainer.scrollLeft;
  },
  false,
);

weekContainer.addEventListener(
  "mouseup",
  function (e) {
    mouseDown = false;
  },
  false,
);

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

let scrolling = null;
let currentPageX = null;

function dragoverHandler(e) {
  e.preventDefault();

  currentPageX = e.pageX;
}

function dragstartHandler(e) {
  e.dataTransfer.setData("text", e.target.id);

  if (scrolling) {
    return;
  }

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
  mouseDown = false;
  if (scrolling) {
    clearInterval(scrolling);
    scrolling = null;
  }

  e.preventDefault();
  data = e.dataTransfer.getData("text");
  e.currentTarget.appendChild(document.getElementById(data));
  day = e.currentTarget.dataset.day;

  post("edittask", {
    user: currentUser,
    id: data,
    feature: "day",
    value: day,
  });
}

// When dropped back into task bank
function onReturnDrop(e) {
  mouseDown = false;
  if (scrolling) {
    clearInterval(scrolling);
    scrolling = null;
  }

  e.preventDefault();
  data = e.dataTransfer.getData("text");
  e.target.appendChild(document.getElementById(data));

  post("edittask", {
    user: currentUser,
    id: data,
    feature: "day",
    value: null,
  });
}

function addTask(name, category, description, date, subject, id, day) {
  if (category == "study") {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}" draggable="true" ondragstart="dragstartHandler(event)">
        <div class="task-data">
            <span class="task-name">${name}</span>
            <span class="task-subject">From ${subject}</span>
        </div>
      </div>`;
    if (day != undefined) {
      document
        .getElementById(`weekday-${day}`)
        .insertAdjacentHTML("beforeend", taskHTML);
    } else {
      taskContainer.innerHTML += taskHTML;
    }
  } else {
    taskHTML = `
      <div class="task" data-name="${name}" data-category="${category}" data-id="${id}" id="${id}" draggable="true" ondragstart="dragstartHandler(event)">
        <div class="task-data">
            <span class="task-name">Continue "${name}"</span>
            <span class="task-subject">From ${subject}</span>
            <span class="task-subject">Due in <span style="font-weight:bold">${Math.round((date - Date.now()) / 86400000)}</span> days</span>
        </div>
      </div>`;
    if (day != undefined) {
      document
        .getElementById(`weekday-${day}`)
        .insertAdjacentHTML("beforeend", taskHTML);
    } else {
      taskContainer.innerHTML += taskHTML;
    }
  }
}

// Get request for currentUser's tasks from database, loops through each tasks and adds them
async function loadTasks() {
  get("tasks", JSON.stringify([currentUser, "all"])).then((data) => {
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

document.addEventListener("DOMContentLoaded", async function () {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  for (let i = 0; i < dayHeadings.length; i++) {
    currentDay = new Date().getDay();
    console.log(currentDay + i);
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

  await loadTasks();
});
