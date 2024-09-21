from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from main.model_user_story import UserStoryRequest
from main.service_user_story import UserStoriesService
from fastapi.responses import JSONResponse
import logging
from jinja2 import Environment, FileSystemLoader, select_autoescape

# Logging Setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

router = APIRouter()

# Jinja2 Template Configuration
env = Environment(
    loader=FileSystemLoader("templates"),  
    autoescape=select_autoescape(['html', 'xml', 'jinja'])
)

def create_context(request: UserStoryRequest) -> dict:
    """
    Creates the context dictionary for Jinja2 template rendering.

    Parameters:
    request (UserStoryRequest): The request object containing user story details.

    Returns:
    dict: A dictionary with context data for template rendering.
    """
    return {
        'application_type': request.application_type,
        'feature': request.feature,
        'feature_for': request.feature_for,
        'user_role': request.user_role
    }

def select_template(feature_for: str) -> str:
    """
    Selects the appropriate Jinja2 template based on the feature_for value.

    Parameters:
    feature_for (str): The feature for which the user story is being generated.

    Returns:
    str: The selected template name.
    """
    templates = {
        "Testing": "testing_user_story_prompt.jinja2",
        "DevOps": "devops_user_story_prompt.jinja2"
    }
    return templates.get(feature_for, "base_user_story_prompt.jinja2")

@router.post("/generate")
async def generate_user_story(request: UserStoryRequest):
    logging.info("Received request to generate user story")

    try:
        context = create_context(request)
        logging.info(f"Request details - {context}")

        env.cache = {}  # Clear any existing cache
        logging.debug("Cleared Jinja2 template cache")

        template_name = select_template(request.feature_for)
        logging.info(f"Using template: {template_name}")

        template = env.get_template(template_name)
        prompt = template.render(context)
        logging.info(f"Generated prompt: {prompt}")

        generated_user_stories = UserStoriesService.generate_user_story(prompt)
        logging.info("Generated user stories successfully")

        return JSONResponse(content=generated_user_stories)

    except ValueError as ve:
        logging.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=422, detail=str(ve))
    except HTTPException as he:
        logging.error(f"HTTP error: {str(he)}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error generating user story: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating user story")

def configure_routes_user_story(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    logging.info("Configuring user story routes")
    app.include_router(router, prefix="/crafter/api/v2/user-story", tags=["User Story"])        
    logging.info("User story routes configured successfully")
