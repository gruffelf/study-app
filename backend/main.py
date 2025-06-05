from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tinydb import TinyDB, Query
import json

subjects = TinyDB('db/subjects.json')
print(json.dumps(subjects.all()))
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

#@app.post("/subjects")
#async def create_subject(subject: str):
#    print(subject)
#    subjects.insert({'name': subject})
#    return {"message": "added subject"}

@app.get("/subjects")
async def get_subjects():
    return json.dumps(subjects.all())
