from pydantic import BaseModel, Field, validator
from typing import List

class UserStoryRequest(BaseModel):
    application_type: str = Field(..., min_length=1, max_length=100, description="Type of the application")
    feature: str = Field(..., min_length=1, max_length=100, description="Feature of the application")
    feature_for: str = Field(..., min_length=1, max_length=50, description="Feature implementation in")
    user_role: str = Field(..., min_length=0, max_length=50, description="Role of the user")

    @validator('feature_for')
    def validate_feature_for(cls, value):
        valid_options = {'End-to-End', 'Front-end', 'Back-end', 'DevOps', 'Testing'}
        if value not in valid_options:
            raise ValueError(f'feature_for must be one of {valid_options}')
        return value
