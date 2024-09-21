from pydantic import BaseModel


class ReviewRequest(BaseModel):
    code: str


class ChatRequest(BaseModel):
    code: str
    userPrompt: str
