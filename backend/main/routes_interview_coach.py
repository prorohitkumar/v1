from fastapi import APIRouter, HTTPException
import logging
import json
from jinja2 import Environment, FileSystemLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

from main.config import API_KEY
from main.model_interview_coach import EvaluateAnswerRequest, QuestionRequest


# Initialize the LLM
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY)

# Initialize Jinja2 environment
env = Environment(loader=FileSystemLoader("./templates"))

# Define the prompt for generating interview questions
questions_prompt_template = """
System Prompt: "Act as an expert online interviewer to check knowledge of the interviewee. The interview is from the {industry} industry working as a {job_role}. You need to generate 10 interview questions on the {topics} topics. Ensure the challenges are blooms level 2 knowledge base and aligned to the given topics. Don't expect users to do something to answer, instead that should be able to answer over phone, online, or face-to-face without using any electronic device. Do not provide any hints in the challenges.
Provide the challenges in a conversational form that a typical human interviewer will ask. Consider the user provided self score {self_score} out of 10 while generating the interview questions. Each question should be independent and should not depend on previous questions.

Some examples are:
 
<example>
Challenge: Explain the difference between a stack and a queue. In what scenarios would you choose to use a stack over a queue, and vice versa?
</example>
 
<example>
Challenge: Explain the Single Responsibility Principle (SRP) and describe a situation where not following this principle could lead to problems in software maintenance.
</example>
 
<example>
Challenge: Describe how you would handle a situation where a long-time client is considering switching to a competitor because they are offering a lower price. How would you convince them to stay?
</example>


Generate the output in JSON format as provided above: output_format"
output_format = """
{
    "interview_questions": [
        {
            "interviewer_question_challenge": "The challenge that the user should attempt and solve. ",
        }
    ]
}
"""
"""

questions_prompt = PromptTemplate.from_template(questions_prompt_template)

# Define the prompt for evaluating answers
evaluation_prompt_template = """
System Prompt: "Act as an expert interviewer. You are interviewing a user for the {job_role} role and {topics} focus areas. The user has rated himself {self_score} out of 10 in the mentioned role and focus areas. You have already asked a question to the user with the following details:

interviewer_question_challenge: {interviewer_question_challenge}

The user has responded with an answer: {user_answer}

You need to analyze the user's answer. First, generate your own best answer and compare the user's answer with your answer. For the user's answer, give a score from 0 to 10. You need to provide feedback with a meaningful explanation for your score along with suggestions on how to improve the score. Finally, suggest what the best answer should be.

Report your analysis in JSON with the structure that will contain the report having following parameters:  interviewer_question_challenge, user_answer, user_answer_score, feedback_to_user, suggested_answer. Do not add ```json at the start of response.
"
"""

evaluation_prompt = PromptTemplate.from_template(evaluation_prompt_template)

# Chains for generating questions and evaluating answers
questions_chain = LLMChain(llm=llm, prompt=questions_prompt, verbose=True)
evaluation_chain = LLMChain(llm=llm, prompt=evaluation_prompt, verbose=True)

router = APIRouter()

# Configure the logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


@router.post("/generate_questions")
def generate_questions(request: QuestionRequest):
    # log data to debug
    logging.info("Data received:", request)
    try:

        response = questions_chain.run(
            industry=request.industry,
            job_role=request.job_role,
            topics=request.topics,
            self_score=request.self_score,
        )
        # logging.info("Request = ", request)
        print(request)
        print(response)
        try:
            # Parse the LLM response as JSON
            response_json = json.loads(response)
            # logging.info("response json = ", response_json)
            print("response = ", response)
            print("response = ", response_json)
            return response_json
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse response")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate_answer")
async def evaluate_answer(request: EvaluateAnswerRequest):
    # log data to debug
    logging.info("Data received:", request)

    try:
        response = evaluation_chain.run(
            job_role=request.job_role,
            topics=request.topics,
            self_score=request.self_score,
            interviewer_question_challenge=request.interviewer_question_challenge,
            user_answer=request.user_answer,
        )

        # Print response to debug
        logging.info("Response from LLM:", response)

        try:
            # Parse the LLM response as JSON
            response_json = json.loads(response)
            return response_json
        except json.JSONDecodeError as e:
            logging.exception(f"JSON decode error: {e}")
            logging.exception(f"Response that caused the error: {response}")
            raise HTTPException(status_code=500, detail="Failed to parse response")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def configure_routes_interview_coach(app):
    """
    Configures routes for the FastAPI application by adding the defined router to the app instance.

    Parameters:
    app (FastAPI): The FastAPI application instance where the router is to be added.
    """
    app.include_router(
        router, prefix="/crafter/api/v2/interview_coach", tags=["interview coach"]
    )
