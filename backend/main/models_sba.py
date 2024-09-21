from pydantic import BaseModel, Field
from typing import List


class Level(BaseModel):
    level: str = Field(..., title="Level Name", description="The name of the level.")
    noOfQuestions: int = Field(..., gt=0, title="Number of Questions", description="The number of questions for this level. Must be greater than 0.")
    keywords: List[str] = Field(..., title="Keywords", description="A list of keywords associated with this level.")

    class Config:
        schema_extra = {
                "level": "Beginner",
                "noOfQuestions": 10,
                "keywords": ["basic", "introductory", "easy"]

        }


class Assessment(BaseModel):
    role: str = Field(..., title="Role", description="The role for which the assessment is created.")
    levels: List[Level] = Field(..., title="Levels", description="A list of levels in the assessment.")
    tools: str = Field(..., title="Tools", description="Tools used for the assessment.")
    hints: bool = Field(..., title="Hints Availability", description="Indicates whether hints are available or not.")

    class Config:
        schema_extra = {
                "role": "Software Engineer",
                "levels": [
                    {
                        "level": "Beginner",
                        "noOfQuestions": 10,
                        "keywords": ["basic", "introductory", "easy"]
                    },
                    {
                        "level": "Intermediate",
                        "noOfQuestions": 15,
                        "keywords": ["medium", "intermediate", "challenging"]
                    }
                ],
                "tools": "Python, FastAPI",
                "hints": True

        }
