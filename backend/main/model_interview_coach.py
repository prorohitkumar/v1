from pydantic import BaseModel


class QuestionRequest(BaseModel):
    industry: str
    job_role: str
    topics: str
    self_score: str


class EvaluateAnswerRequest(BaseModel):
    job_role: str
    topics: str
    self_score: str
    interviewer_question_challenge: str
    user_answer: str
