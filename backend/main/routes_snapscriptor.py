from fastapi import File, UploadFile, HTTPException, APIRouter
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from main.snapscriptor import model
import logging


router = APIRouter()


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


@router.post("/chat")
async def chat(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format. Only JPEG and PNG allowed",
        )

    image_data = await file.read()
    logging.info(
        f"Image file received for analysis and scripting {len(image_data)} bytes"
    )

    prompt = "Your role as an engineer requires a thorough analysis and elucidation of the technical aspects depicted in the provided image. Focus your explanation on components, architecture, algorithms, protocols, and other relevant technical elements pertinent to software engineering, project management, and information technology. Ensure that your analysis is detailed and accessible to technical audiences. However, if the image depicts subjects such as animals, scenery, objects not related to information technology field, trees, or human beings, or if it lacks relevance to software engineering, project management, or information technology, your response should simply state 'Non-technical'. Remember to format your response in Markdown and ensure it exceeds 100 words to provide a comprehensive analysis."

    image_parts = [
        {"mime_type": file.content_type, "data": image_data},
    ]

    prompt_parts = [prompt, image_parts[0]]

    try:
        response = model.generate_content(
            prompt_parts,
            safety_settings={
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            },
        )
        generated_text = response.parts[0].text
        return {"response": generated_text}
    except Exception as e:
        if hasattr(response, "candidates") and response.candidates[0].safety_ratings:
            logging.error("Exception caused due to safety rating")
            for rating in response.candidates[0].safety_ratings:
                print(f"{rating.category}: {rating.probability}")
        else:
            logging.error(f"Error generating content: {e}")
            print(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


def configure_routes_snap_scriptor(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router, prefix="/crafter/api/v2/snap_scriptor", tags=["Snap Scriptor"])
