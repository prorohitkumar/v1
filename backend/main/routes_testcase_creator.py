from fastapi import APIRouter, Body, HTTPException
from main.service_testcase_creator import TestCaseCreatorService
from main.models_testcase_creator import TestCaseRequest
import logging

router = APIRouter()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%d/%m/%Y %H:%M:%S",
)


@router.post(
    "/generate",
    summary="Generate test cases for given code",
    response_description="",
)
def create_test_cases(request: TestCaseRequest = Body(...)):
    """
    Endpoint to generate a test cases based on the provided details.

    Parameters:
        request (Code): Testcases request payload.

    Returns:
        json: Generated test cases or error message.
    """
    try:
        # logging.info(request.code)
        testcaseCreater_service = TestCaseCreatorService()
        response = testcaseCreater_service.create_test_cases(request)
        logging.info(response)
        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating test cases: {str(e)}"
        )


@router.post(
    "/regenerate",
    summary="regenerate test cases for given planner test cases",
    response_description="",
)
def regenerate_test_cases(request: TestCaseRequest = Body(...)):
    """
    Endpoint to generate a test cases based on the provided details.

    Parameters:
        request (Code): Testcase request payload.

    Returns:
        json: Generated test cases or error message.
    """
    try:
        logging.info("code:", request.code)
        logging.info("planner:", request.planner)
        testcaseCreater_service = TestCaseCreatorService()
        response = testcaseCreater_service.regenerate_test_cases(request)
        logging.info(response)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating test cases: {str(e)}"
        )


def configure_routes_testcase_creator(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(
        router, prefix="/crafter/api/v2/testcase-creator", tags=["TestCase Creator"]
    )
