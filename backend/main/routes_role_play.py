from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from main.service_role_play import generate_role_play, generate_docx
import logging

router = APIRouter()

# Pydantic models for request body validation
class RolePlayRequest(BaseModel):
    industry: str
    learningObjective: str
    roles: List[str]
    skills: List[str]
    complexity: str = None
    experience: str = None
    industryContext: str = None
    scenarioSettings: str = None

class DocxRequest(BaseModel):
    markdown_content: str

@router.post("/generate")
async def generate_role_play_endpoint(request: RolePlayRequest):
    """
    Receives role play configuration data as JSON, validates it, and uses it to generate a role play exercise.
    """
    try:
        role_play_data = request.dict()
        response = await generate_role_play(role_play_data)
        return {"role_play_exercise": response}
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing key in input data: {str(e)}")
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/download-docx")
async def download_docx_endpoint(request: DocxRequest):
    """
    Receives markdown content and converts it to a downloadable DOCX file.
    """
    try:
        markdown_content = request.markdown_content
        file_path = await generate_docx(markdown_content)
        return FileResponse(file_path, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', filename="role-play.docx")
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    



def configure_routes_role_play(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router, prefix="/crafter/api/v2/role-play", tags=["Role - Play"])

