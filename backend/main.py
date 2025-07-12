from array import array
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from tinydb import TinyDB, Query
import json

db = TinyDB('db/db.json')

# SCHEMA
#db.insert({'user': 'gruffelf', 'pass': 'secret', 'tasks': ["a","b"]})
schema = {'user': '', 'pass': '', 'tasks': [], 'subjects': ["default"]}

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/test")
async def test():
    return {"message": "Hello World"}

# Returns a specified users tasks from the database
@app.get("/tasks/{data}")
async def get_tasks(data: str):
    data = json.loads(data)
    user = data[0]
    subject = data[1]
    tasks = db.search(Query().user == user)[0]["tasks"]
    filtered = []

    if subject == "all":
        return json.dumps(tasks)

    for task in tasks:
        if task["subject"] == subject:
            filtered.append(task)
    return json.dumps(filtered)

# Recieves login credentials, and checks if they are valid, returninga boolean
@app.get("/login/{creds}")
async def login(creds: str):
    creds = json.loads(creds)
    validEntries = db.search(Query().user == creds[0])

    if len(validEntries) == 0:
        return json.dumps({"status": False})
    else:
        for i in validEntries:
            if i["pass"] == creds[1]:
                return  json.dumps({"status": True})
        return json.dumps({"status": False})

@app.get("/createAccount/{creds}")
async def createAccount(creds: str):
    creds = json.loads(creds)

    if (db.search(Query().user == creds[0])):
        return json.dumps({"status": False})
    else:
        entry = schema
        entry['user'] = creds[0]
        entry['pass'] = creds[1]
        db.insert(entry)
        return json.dumps({"status": True})

@app.get("/subjects/{user}")
async def get_subjects(user: str):
    return json.dumps(db.search(Query().user == user)[0]["subjects"])

@app.post("/addtask")
async def add_task(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        oldTasks = db.search(Query().user == data["user"])[0]["tasks"]
        newTask = {"name": data["name"],"category": data["category"], "subject": data["subject"], "description": data["description"], "date": data["date"], "id": data["id"]}

        db.update({"tasks": oldTasks + [newTask]}, Query().user == data["user"])

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/deltask")
async def del_task(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        tasks = db.search(Query().user == data["user"])[0]["tasks"]
        print(data["id"])
        for i in tasks:
            if i["id"] == data["id"]:

                tasks.remove(i);

        db.update({"tasks": tasks}, Query().user == data["user"])

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/addsubject")
async def add_subject(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)
        user = data["user"]
        subject = data["subject"]

        subjects = db.search(Query().user == user)[0]["subjects"]

        if subject in subjects:
            return {"error": "Subject Already Exists"}

        if subject == "all":
            return {"error": "Invalid Subject Name"}

        subjects.append(subject)

        db.update({"subjects": subjects}, Query().user == data["user"])

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/delsubject")
async def del_subject(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)
        user = data["user"]
        subject = data["subject"]

        subjects = db.search(Query().user == user)[0]["subjects"]

        if [subject] == subjects:
            return {"error": "Can't delete last subject"}

        subjects.remove(subject)

        db.update({"subjects": subjects}, Query().user == data["user"])

        tasks = db.search(Query().user == user)[0]["tasks"]
        delList = []

        for i in tasks:
            if i["subject"] == subject:
                delList.append(i)

        for i in delList : tasks.remove(i)

        db.update({"tasks": tasks}, Query().user == data["user"])

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/edittask")
async def edit_task(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        if data["feature"] == "day":
            tasks = db.search(Query().user == data["user"])[0]["tasks"]

            for i in tasks:
                if i["id"] == data["id"]:
                    if data["value"]:
                        i.update({"day": data["value"]})
                    else:
                        i.pop("day")

            db.update({"tasks": tasks}, Query().user == data["user"])

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}
