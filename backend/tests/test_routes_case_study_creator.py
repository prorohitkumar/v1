from fastapi.testclient import TestClient
from main.app import app

client = TestClient(app)

def test_check():
    response = client.get("/crafter/api/v2/CaseStudyCreator/check")
    assert response.status_code == 200
    assert response.text == '"Hello From Case Study Creator Back-End"'

def test_generate_case_study():
    response = client.post(
        "/crafter/api/v2/CaseStudyCreator/generate",
        json={
            "case_study_name": "AI in Healthcare",
            "role": "Data Scientist",
            "scenario_description": "Exploring AI applications in healthcare.",
            "keywords": ["AI", "Healthcare", "Machine Learning"],
            "tools_and_technologies": ["Python", "TensorFlow", "Pandas"],
            "number_of_participants": 5,
            "duration_in_hrs": 10
        }
    )
    assert response.status_code == 200
    assert "case_study" in response.json()