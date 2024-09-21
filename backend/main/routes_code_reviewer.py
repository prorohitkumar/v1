from fastapi import APIRouter, HTTPException

from main.model_code_reviewer import ChatRequest, ReviewRequest
from main.service_code_reviewer import CodeAssistant, CodeReviewer

router = APIRouter()


@router.post("/review_code")
async def review_code(request: ReviewRequest):
    try:
        print(request.code)
        reviewer = CodeReviewer()
        review = reviewer.generate_review(request.code)
        print(review)
        return {"review": review}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        assistant = CodeAssistant()
        response = assistant.generate_response(request.code, request.userPrompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def configure_routes_code_reviewer(app):
    app.include_router(
        router, prefix="/crafter/api/v2/code_reviewer", tags=["code reviewer"]
    )
