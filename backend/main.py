from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from tinydb import TinyDB, Query
import json

db = TinyDB('db/db.json')

# SCHEMA
#db.insert({'user': 'gruffelf', 'pass': 'secret', 'tasks': ["a","b"]})

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
@app.get("/tasks/{user}")
async def get_tasks(user: str):
    return json.dumps(db.search(Query().user == user)[0]["tasks"])

@app.post("/addtask")
async def add_task(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        oldTasks = db.search(Query().user == data["user"])[0]["tasks"]
        newTask = {"name": data["name"],"category": data["category"]}

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
        print(data["name"])
        for i in tasks:
            if i["name"] == data["name"]:

                tasks.remove(i);

        db.update({"tasks": tasks}, Query().user == data["user"])

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}
