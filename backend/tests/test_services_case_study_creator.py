import pytest
from main.services_case_study_creator import CaseStudyService

@pytest.mark.asyncio
async def test_generate_case_study():
    case_study_service = CaseStudyService()
    data = {
        "case_study_name": "AI in Healthcare",
        "role": "Data Scientist",
        "scenario_description": "Exploring AI applications in healthcare.",
        "keywords": ["AI", "Healthcare", "Machine Learning"],
        "tools_and_technologies": ["Python", "TensorFlow", "Pandas"],
        "number_of_participants": 5,
        "duration_in_hrs": 10
    }
    response = await case_study_service.generate_case_study(data)
    assert "Case Study" in response