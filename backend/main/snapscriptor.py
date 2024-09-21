from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import logging
from main.config import API_KEY

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

genai.configure(api_key=API_KEY)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

config = {"temperature": 0, "top_k": 20, "top_p": 0.9, "max_output_tokens": 1048576}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-latest",
    generation_config=config,
)


# Define routes
@app.get("/")
async def hello_world():
    logging.info("Testing endpoint")
    return {"message": "Hi, have a great day!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
