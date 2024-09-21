from fastapi import APIRouter, HTTPException, Request
from main.service_sba import generate_exercise
from main.models_sba import Assessment
import logging


api_router = APIRouter()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%d/%m/%Y %H:%M:%S",
)

@api_router.get('/check')
async def check():
    """
    Endpoint to check if the server is running.

    Returns:
        str: A greeting message indicating that the server is running.
    """
    return "Hello From EXERETO Back-End"


@api_router.post('/exercise')
async def exercise(request: Assessment):
    """
    Endpoint to generate an exercise based on the given assessment data.

    Args:
        request (Assessment): The assessment data used to generate the exercise.

    Returns:
        dict: The generated exercise data.

    Raises:
        HTTPException: If a ValueError occurs, indicating a bad request (status code 400).
        HTTPException: If any other exception occurs, indicating an internal server error (status code 500).
    """
    try:
        # Generate the exercise using the provided assessment data
        # print(request.dict())  # Log the received data
        result = await generate_exercise(request)
        return result
    except ValueError as e:
        # Raise an HTTP 400 Bad Request error if a ValueError is encountered
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Raise an HTTP 500 Internal Server Error for any other exceptions
        raise HTTPException(status_code=500, detail="Error generating exercise: {}".format(str(e)))


def configure_routes_sba(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router=api_router, prefix='/crafter/api/v2/Exercise')
