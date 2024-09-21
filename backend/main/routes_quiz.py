from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List
from main.config import API_KEY
import requests

router = APIRouter()

class MetaData(BaseModel):
    numberOfQuestions: int
    difficulty: str

class QuickQuiz(BaseModel):
    language: str
    concept: str
    meta: List[MetaData]

class SerRes(BaseModel):
    answer: str

API_KEY = API_KEY

@router.get("/crafter/api/v2/ai/greet")
def greet():
    return "Good Morning, Have a nice day"

@router.post("/crafter/api/v2/ai/create/quickQuiz", response_model=SerRes)
def create_quick_quiz(quizData: QuickQuiz):
    try:
        answer = get_quiz_response(quizData)
        return SerRes(answer=answer)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Not able to process the query, Please try again later!!"
        )

def get_quiz_response(quizData: QuickQuiz) -> str:
    try:
        apiUrl = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}"

        headers = {
            "Content-Type": "application/json"
        }

        # Use the original prompt format and incorporate the language context
        prompt = (
            "You are a technical mentor preparing an MCQ question paper for pre-assessment targeting learners."
        )

        concept = quizData.concept
        language = quizData.language
        meta = quizData.meta
        for data in meta:
            prompt += (
                f"\n- Create {data.numberOfQuestions} MCQ-based questions along with answers on the {concept} concept "
                f"using the {language} language with difficulty level as {data.difficulty}."
            )

        generationConfig = {
            "temperature": 0.9,
            "topK": 1,
            "topP": 1,
            "maxOutputTokens": 2048,
            "stopSequences": []
        }

        safetySettings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
        ]

        exampleFormat = (
            "MCQ has to be in the following format:\n\n"
            "1. Question 1\n"
            "A. Option 1\n"
            "B. Option 2\n"
            "C. Option 3\n"
            "D. Option 4\n"
            "Answer: A. Option 1"
        )

        requestBody = {
            "contents": [{"parts": [{"text": prompt + exampleFormat}]}],
            "generationConfig": generationConfig,
            "safetySettings": safetySettings
        }

        response = requests.post(apiUrl, json=requestBody, headers=headers)
        response.raise_for_status()  # Raise an HTTPError for bad responses

        res_model = response.json()
        answer = res_model["candidates"][0]["content"]["parts"][0]["text"]
        return answer

    except Exception as e:
        print("Service Exception:", e)
        raise Exception("Error in getting response from Gemini API")

def configure_routes_quick_quiz(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router, prefix="/crafter/api/v2/quick-quiz", tags=["Quick-Quiz"])
