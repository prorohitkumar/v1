from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List
from main.service_interview import ChatService
from main.config import API_KEY
import logging

router = APIRouter()

# Pydantic models for request body validation
class QuestionRequest(BaseModel):
    domain: str
    role: str
    difficulty_level: str
    specific_topic: str
    num_questions: int = 15

@router.post("/generate_questions")
async def generate_questions(request: QuestionRequest):
    """
    Receives interview question configuration data as JSON, validates it, and uses it to generate interview questions.
    """
    try:
        data = request.dict()
        domain = data['domain']
        role = data['role']
        difficulty_level = data['difficulty_level']
        specific_topic = data['specific_topic']
        num_questions = data.get('num_questions', 15)

        logging.info("Called for generating questions")

        api_key = API_KEY  # Replace 'YOUR_API_KEY' with your actual API key
        chat_service = ChatService(api_key)
        interview_questions = await chat_service.get_interview_questions(domain, role, difficulty_level, specific_topic, num_questions)

        for i, question in enumerate(interview_questions, start=1):
            print(f"Question {i}: {question['question']}")
            print(f"Answer : {question['answer']}")

        return {"questions": interview_questions}

    except Exception as e:
        logging.error(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

def configure_routes_interview(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router, prefix="/crafter/api/v2/interview", tags=["Interview"])


