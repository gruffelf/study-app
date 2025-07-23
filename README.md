# study-app
Finally a project managment tool for high school students, to keep you focused and on track.

## How to view (im self hosting)
Visit page here [mdr-core.torpy.co/study](https://mdr-core.torpy.co/study)

## How to run (simple)
If you can't use my website, run the website yourself.
1. ```git clone https://github.com/gruffelf/study-app.git```
2. ```cd study-app```
3. ```pip install -r backend/requirements.txt```
4. ```fastapi dev backend/main.py```
5. Open frontend/index.html in a web browser and all functionality should be available
If this doesn't work check what port fastapi is running on and update the API_URL variable at the start of frontend/scripts/app.js to localhost:(whatever port fastapi is running on)

## How to run (advanced)
### Web Server
HTML, CSS, JS, and asset files, running on web server.
**Make sure to set API_URL variable in app.js to whatever the API server is running on.**

### API Server
main.py, running with a python virtual environment through FastAPI cli, and requirements.txt downloaded with pip.
```
pip install -r requirements.txt
fastapi run main.py
```

## About study-app

### Study Page
<img width="400" height="auto" alt="image" src="https://github.com/user-attachments/assets/fa1b9b6b-4bc2-43eb-8c2a-4a30a86ad023" />

On the study page, you can add tasks to Studying Tasks or Assessment Tasks. Studying tasks are tasks that you will repeat and have no due date, whereas assessment tasks have a due date. You can add, edit and delete tasks from this page.

### Calender Page
<img width="400" height="auto" alt="image" src="https://github.com/user-attachments/assets/523ff3b7-857a-4fbb-b5f1-aef035af4f6d" />

On this page, you drag the tasks you have created on the study page into each day of the week. You can use this to plan out your week and what tasks you will work on. The website will remember what day you dragged them on and will stay there for upcoming weeks. Dragging tasks onto a day is used to represent days that you will work on them, not days that they are due

### Today Page
<img width="400" height="auto" alt="image" src="https://github.com/user-attachments/assets/a3f7df0c-a1c9-4b84-a540-40660d0195c0" />

On this page, you will see the tasks you have assigned to the current day, and a pomodoro timer to organise time to work on those tasks. A pomodoro timer is a technique to split your time into 25 minute work intervals, seperated by a 5 minute break, and a 30 minute break every 4 intervals. This is used to increase productivity and get things done.
