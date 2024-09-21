from pydantic import BaseModel, Field
from typing import List


class CaseStudyRequest(BaseModel):
    case_study_name: str = Field(..., description="Name of the case study")
    role: str = Field(
        ..., description="Role of the person for whom the case study is created"
    )
    scenario_description: str = Field(
        ..., description="Description of the case study scenario"
    )
    keywords: List[str] = Field(
        ..., description="Keywords associated with the case study"
    )
    tools_and_technologies: List[str] = Field(
        default=[], description="Tools and technologies involved in the case study"
    )
    number_of_participants: int = Field(
        2, ge=1, description="Number of participants required for the case study"
    )
    duration_in_hrs: int = Field(
        8, ge=1, description="Duration in hours for completing the case study"
    )
