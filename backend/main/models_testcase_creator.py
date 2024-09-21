from pydantic import BaseModel
from typing import Optional


class TestCaseRequest(BaseModel):
    code: str
    planner: Optional[str] = None
