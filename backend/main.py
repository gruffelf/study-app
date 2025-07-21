from array import array
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from tinydb import TinyDB, Query
import json
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

secret_key = "my_secret_key"

def create_token(data, expires: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires or timedelta(days=7))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm="HS256")

def decode_token(token):
    return jwt.decode(token, secret_key, algorithms=["HS256"])

def get_user(token):
    payload = decode_token(token)
    username = payload.get("sub")
    if username is None:
        raise
    return username

db = TinyDB('db/db.json')
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)

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

@app.get("/verify-token/{data}")
async def verify_token(data: str, request: Request):
    try:
        user = get_user(request.headers.get("token"))
        return json.dumps({"status":"true","user":user})
    except:
        return json.dumps({"status":"false"})



@app.get("/test")
async def test():
    return {"message": "Hello World"}

# Returns a specified users tasks from the database
@app.get("/tasks/{data}")
async def get_tasks(data: str, request: Request):
    data = json.loads(data)
    try:
        user = get_user(request.headers.get("token"))
    except:
        return {"Auth Error"}
    subject = data[1]

    tasks = db.search(Query().user == user)[0]["tasks"]
    filtered = []

    if len(data) == 3:
        day = data[2]
        for task in tasks:
            if "day" in task:
                if str(task["day"]) == str(day):
                    filtered.append(task)
        return json.dumps(filtered)

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
            if verify_password(creds[1], i["pass"]):
                token = create_token({"sub": creds[0]})
                return  json.dumps({"status": True, "access_token":token,"token_type": "bearer"})
        return json.dumps({"status": False})

@app.get("/createAccount/{creds}")
async def createAccount(creds: str):
    creds = json.loads(creds)

    if (db.search(Query().user == creds[0])):
        return json.dumps({"status": False})
    else:
        entry = schema
        entry['user'] = creds[0]
        entry['pass'] = hash_password(creds[1])
        db.insert(entry)
        token = create_token({"sub": creds[0]})
        return json.dumps({"status": True, "access_token":token,"token_type": "bearer"})

@app.get("/subjects/{user}")
async def get_subjects(user: str, request: Request):
    try:
        user = get_user(request.headers.get("token"))
    except:
        return {"Auth Error"}
    print(json.dumps(db.search(Query().user == user)[0]["subjects"]))
    return json.dumps(db.search(Query().user == user)[0]["subjects"])

@app.post("/addtask")
async def add_task(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        try:
            user = get_user(data["user"])
        except:
            return {"Auth Error"}

        oldTasks = db.search(Query().user == user)[0]["tasks"]
        newTask = {"name": data["name"],"category": data["category"], "subject": data["subject"], "description": data["description"], "date": data["date"], "id": data["id"]}

        db.update({"tasks": oldTasks + [newTask]}, Query().user == user)

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/deltask")
async def del_task(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        try:
            user = get_user(data["user"])
        except:
            return {"Auth Error"}

        tasks = db.search(Query().user == user)[0]["tasks"]
        print(data["id"])
        for i in tasks:
            if i["id"] == data["id"]:

                tasks.remove(i);

        db.update({"tasks": tasks}, Query().user == user)

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/addsubject")
async def add_subject(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        try:
            user = get_user(data["user"])
        except:
            return {"Auth Error"}

        subject = data["subject"]
        subjects = db.search(Query().user == user)[0]["subjects"]

        if subject in subjects:
            return {"error": "Subject Already Exists"}

        if subject == "all":
            return {"error": "Invalid Subject Name"}

        subjects.append(subject)

        db.update({"subjects": subjects}, Query().user == user)

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/delsubject")
async def del_subject(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)
        try:
            user = get_user(data["user"])
        except:
            return {"Auth Error"}
        subject = data["subject"]

        subjects = db.search(Query().user == user)[0]["subjects"]

        if [subject] == subjects:
            return {"error": "Can't delete last subject"}

        subjects.remove(subject)

        db.update({"subjects": subjects}, Query().user == user)

        tasks = db.search(Query().user == user)[0]["tasks"]
        delList = []

        for i in tasks:
            if i["subject"] == subject:
                delList.append(i)

        for i in delList : tasks.remove(i)

        db.update({"tasks": tasks}, Query().user == user)

        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}

@app.post("/edittask")
async def edit_task(request: Request):
    data = await request.body()

    try:
        data = json.loads(data)

        try:
            user = get_user(data["user"])
        except:
            return {"Auth Error"}

        if data["feature"] == "day":
            tasks = db.search(Query().user == user)[0]["tasks"]

            for i in tasks:
                if i["id"] == data["id"]:
                    if data["value"]:
                        i.update({"day": data["value"]})
                    else:
                        i.pop("day")

            db.update({"tasks": tasks}, Query().user == user)
        elif data["feature"] == "all":
            tasks = db.search(Query().user == user)[0]["tasks"]

            for i in tasks:
                if i["id"] == data["id"]:
                    i.update({"name": data["name"]})
                    i.update({"description": data["description"]})
                    i.update({"date": data["date"]})
            db.update({"tasks": tasks}, Query().user == user)


        return {"message": "Data received"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}
