from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from main.service_assessment_creator import generate_assessment
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

router = APIRouter()

# Pydantic models for request body validation
class Card(BaseModel):
    keywords: List[str]
    tools: List[str]
    level: str
    noOfQuestions: int

class AssessmentRequest(BaseModel):
    role: str
    cards: List[Card]



@router.post("/generate")
async def generate_assessment_endpoint(request: AssessmentRequest):
    """
    Receives assessment configuration data as JSON, validates it, and uses it to generate an assessment.

    Processes the incoming JSON data, validates presence of all required fields, and calls the assessment
    generation service. Handles various errors and exceptions by returning appropriate HTTP status codes and
    error messages.

    Returns:
    dict: A dictionary containing the generated assessment text on success or an error message on failure.
    """
    try:
        assessment_data = request.dict()  # Convert request to dictionary
        response = await generate_assessment(assessment_data)
        return {"assessment": response}
    except KeyError as e:
        raise HTTPException(
            status_code=400, detail=f"Missing key in input data: {str(e)}"
        )
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

def configure_routes_assessment(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router, prefix="/crafter/api/v2/assessment-creator", tags=["Assessment Creator "])
