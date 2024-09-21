from fastapi import APIRouter, HTTPException
from main.models_case_study_creator import CaseStudyRequest
from main.services_case_study_creator import CaseStudyService

api_router = APIRouter()

@api_router.get('/check', summary="Check API status", response_description="API status message")
async def check():
  
    return "Hello From Case Study Creator Back-End"

@api_router.post('/generate', summary="Generate a case study", response_description="Generated case study details")
async def generate_case_study(request: CaseStudyRequest):
    """
    Endpoint to generate a case study based on the provided details.

    Parameters:
        request (CaseStudyRequest): The case study request payload.

    Returns:
        dict: Generated case study details or error message.
    """
    try:
        case_study_service = CaseStudyService()
        response = await case_study_service.generate_case_study(request)
        return {"case_study": response}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating case study: {str(e)}")
    
def configure_routes_case_study_creator(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router=api_router, prefix='/crafter/api/v2/CaseStudyCreator' , tags=["Case Study Creator"])