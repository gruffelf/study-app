from fastapi import Fast

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
