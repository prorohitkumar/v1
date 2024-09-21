from fastapi import APIRouter, Body, HTTPException
from main.model_blog import BlogInput
from main.blog_crafter import authorize_credentials, model
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from googleapiclient import discovery
import markdown
import httplib2
import logging


router = APIRouter()

# Configure the logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


@router.post("/blog")
async def create_blog(blog_input: BlogInput):
    global input_text
    input_text = blog_input.input_text
    logging.info(
        f"Generating a blog with input text:{input_text} and incorporated with keywords: {blog_input.keywords} with {blog_input.no_words} for {blog_input.blog_style}"
    )
    prompt = f"""Act as a blog post writer. You need to write a blog post on {input_text} with some hashtags 
    incorporating these {blog_input.keywords}. Ensure that the blog post is of around {blog_input.no_words} words.
    The blog post should address blog {blog_input.blog_style} level readers.
    Make sure not to mention number of words counting in response."""

    response = model.generate_content(
        prompt,
        safety_settings={
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        },
    )

    generated_blog = response.parts[0].text
    return {"blog_content": generated_blog}


@router.post("/blogPost")
async def post_to_blog():
    credentials = authorize_credentials()
    http = credentials.authorize(httplib2.Http())
    discoveryUrl = "https://blogger.googleapis.com/$discovery/rest?version=v3"
    service = discovery.build(
        "blogger", "v3", http=http, discoveryServiceUrl=discoveryUrl
    )

    blog_content = await create_blog(
        BlogInput(input_text=input_text, no_words="", blog_style="", keywords="")
    )
    content = markdown.markdown(blog_content["blog_content"])

    payload = {"content": content, "title": input_text}

    logging.info("Posting a blog")
    try:
        insert = (
            service.posts().insert(blogId="866940012323373450", body=payload).execute()
        )
        return insert
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def configure_routes_blog_crafter(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(router, prefix="/crafter/api/v2/blog_crafter", tags=["Blog Crafter"])
