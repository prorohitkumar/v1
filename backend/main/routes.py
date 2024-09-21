from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List
from main.service_assessment_creator import generate_assessment
import logging
from jinja2 import Environment, FileSystemLoader, select_autoescape


# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

router = APIRouter()

env = Environment(
    loader=FileSystemLoader(
        "templates"
    ),  # Load templates from the 'templates' directory
    autoescape=select_autoescape(
        ["html", "xml", "jinja"]
    ),  # Autoescape HTML, XML, and Jinja templates
)


# Pydantic models for request body validation
class Card(BaseModel):
    keywords: List[str]
    tools: List[str]
    level: str

    noOfQuestions: int


class AssessmentRequest(BaseModel):
    role: str
    cards: List[Card]

VALID_TOKEN = "your-secure-token"
def verify_token(authorization: str = Header(...)):
    if authorization != f"Bearer {VALID_TOKEN}":
        raise HTTPException(status_code=401, detail="Invalid or missing token")

@router.get("/")
async def hello():
    """
    A simple endpoint to return a greeting. Useful for verifying that the API is operational.

    Returns:
    str: A greeting message indicating the API is up and running.
    """
    return "Hello From Assessment Creator Back-End"

@router.get("/check")
async def helloCheck(token: str = Depends(verify_token)):
    """
    A simple endpoint to return a greeting. Useful for verifying that the API is operational.

    Returns:
    str: A greeting message indicating the API is up and running.
    """
    return {"Message": "Hello From Content crafter backend"}


@router.post("/generate_assessment")
async def generate_assessment_endpoint(request: AssessmentRequest, token: str = Depends(verify_token)):
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


def configure_routes(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router, prefix="/crafter/api/v2", tags=["Assessment Creator"])
