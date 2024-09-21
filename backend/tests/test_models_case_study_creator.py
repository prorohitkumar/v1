import pytest
from pydantic import ValidationError
from main.models_case_study_creator import CaseStudyRequest

def test_case_study_request_valid_data():
    valid_data = {
        "case_study_name": "AI in Healthcare",
        "role": "Data Scientist",
        "scenario_description": "Exploring AI applications in healthcare.",
        "keywords": ["AI", "Healthcare", "Machine Learning"],
        "tools_and_technologies": ["Python", "TensorFlow", "Pandas"],
        "number_of_participants": 5,
        "duration_in_hrs": 10
    }
    case_study_request = CaseStudyRequest(**valid_data)
    assert case_study_request.case_study_name == "AI in Healthcare"

def test_case_study_request_invalid_data():
    invalid_data = {
        "case_study_name": "AI in Healthcare",
        "role": "Data Scientist",
        "scenario_description": "Exploring AI applications in healthcare.",
        "keywords": ["AI", "Healthcare", "Machine Learning"],
        "tools_and_technologies": ["Python", "TensorFlow", "Pandas"],
        "number_of_participants": -1,
        "duration_in_hrs": 10
    }
    with pytest.raises(ValidationError):
        CaseStudyRequest(**invalid_data)