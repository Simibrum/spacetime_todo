# main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import asyncio
import aiohttp
from motor.motor_asyncio import AsyncIOMotorClient
import os

app = FastAPI()

# CORS middleware configuration
origins = [
    "http://localhost:3000",  # React app's address
    "http://localhost:8080",  # Alternative local development server
    "http://frontend:3000",   # Docker container name for frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use environment variable for MongoDB URL, with a default fallback
# Note the addition of '?ssl=false' to explicitly disable SSL
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongo:27017/?ssl=false")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.tododb


# Pydantic models
class TaskInstance(BaseModel):
    id: str
    completedAt: datetime
    duration: int


class TaskExecution(BaseModel):
    time: int
    space: int
    details: dict
    instances: List[TaskInstance]


class TaskImpact(BaseModel):
    timePast: int
    timeFuture: int
    space: int


class Task(BaseModel):
    id: Optional[str]
    name: str
    execution: TaskExecution
    impact: TaskImpact


# API routes
@app.post("/tasks/")
async def create_task(task: Task):
    task_dict = task.dict()
    if task.id is None:
        task_dict["_id"] = str(ObjectId())  # Generate new ID if not provided
    else:
        task_dict["_id"] = task.id
    await db.tasks.insert_one(task_dict)
    return {"id": task_dict["_id"]}


@app.get("/tasks/")
async def read_tasks():
    tasks = await db.tasks.find().to_list(1000)
    return tasks


@app.get("/tasks/{task_id}")
async def read_task(task_id: str):
    task = await db.tasks.find_one({"_id": task_id})
    if task:
        return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.put("/tasks/{task_id}")
async def update_task(task_id: str, task: Task):
    await db.tasks.update_one({"_id": task_id}, {"$set": task.dict()})
    return {"message": "Task updated successfully"}


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    result = await db.tasks.delete_one({"_id": task_id})
    if result.deleted_count:
        return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")


# Async LLM API call (example)
async def call_llm_api(task: Task):
    async with aiohttp.ClientSession() as session:
        async with session.post('https://api.openai.com/v1/completions', json={
            "model": "text-davinci-002",
            "prompt": f"Analyze the impact of the task: {task.name}",
            "max_tokens": 100
        }, headers={
            "Authorization": "Bearer YOUR_API_KEY"
        }) as response:
            return await response.json()


@app.post("/tasks/{task_id}/analyze")
async def analyze_task(task_id: str, background_tasks: BackgroundTasks):
    task = await db.tasks.find_one({"_id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    background_tasks.add_task(analyze_task_background, task)
    return {"message": "Task analysis started"}


async def analyze_task_background(task: Task):
    result = await call_llm_api(task)
    # Process the result and update the task
    updated_impact = process_llm_result(result)
    await db.tasks.update_one({"_id": task.id}, {"$set": {"impact": updated_impact}})


def process_llm_result(result):
    # Process the LLM result and return updated impact
    # This is a placeholder - actual implementation would depend on LLM output
    return TaskImpact(timePast=100, timeFuture=200, space=50)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)