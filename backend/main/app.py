from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from main.routes_auth import configure_routes_auth
from main.routes_case_study_creator import configure_routes_case_study_creator
from main.routes import configure_routes
from main.routes_interview_coach import configure_routes_interview_coach
from main.routes_sba import configure_routes_sba
from main.routes_user_story import configure_routes_user_story
from main.routes_testcase_creator import configure_routes_testcase_creator
from main.routes_assessment_creator import configure_routes_assessment
from main.routes_code_reviewer import configure_routes_code_reviewer
from main.routes_blog_crafter import configure_routes_blog_crafter
from main.routes_snapscriptor import configure_routes_snap_scriptor
from main.routes_role_play import configure_routes_role_play
from main.routes_interview import configure_routes_interview
from main.routes_quiz import configure_routes_quick_quiz
import uvicorn

app = FastAPI()

# Apply CORS middleware to the FastAPI app to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

configure_routes_auth(app)
configure_routes(app)  # Add the configured routes to the FastAPI app
configure_routes_sba(app)
configure_routes_user_story(app)
configure_routes_assessment(app)
configure_routes_case_study_creator(app)
configure_routes_testcase_creator(app)
configure_routes_code_reviewer(app)
configure_routes_blog_crafter(app)
configure_routes_snap_scriptor(app)
configure_routes_role_play(app)
configure_routes_interview(app)
configure_routes_quick_quiz(app)
configure_routes_interview_coach(app)


def create_app():
    return app


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
