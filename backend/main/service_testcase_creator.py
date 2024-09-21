from fastapi import Body
import requests
from main.config_testcase_creator import GENERATION_CONFIG, API_KEY
from jinja2 import Environment, FileSystemLoader

from main.models_testcase_creator import TestCaseRequest

# Initialize Jinja2 environment
env = Environment(loader=FileSystemLoader("./templates"))


class TestCaseCreatorService:
    def create_test_cases(self, data: TestCaseRequest = Body(...)):
        apiUrl = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

        headers = {"Content-Type": "application/json"}
        generation_config = GENERATION_CONFIG

        template = env.get_template("generate_test_cases_prompt.jinja2")
        prompt = template.render(code=data.code)

        request_body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": generation_config,
        }

        response = requests.post(apiUrl, json=request_body, headers=headers)
        response.raise_for_status()
        response_data = response.json()

        resp = [
            candidate["content"]["parts"][0]["text"]
            for candidate in response_data["candidates"]
        ]
        # print(resp)
        return resp

    def regenerate_test_cases(self, data: TestCaseRequest = Body(...)):
        apiUrl = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

        headers = {"Content-Type": "application/json"}
        generation_config = GENERATION_CONFIG

        template = env.get_template("regenerate_test_cases_prompt.jinja2")
        prompt = template.render(code=data.code, planner=data.planner)

        request_body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": generation_config,
        }

        response = requests.post(apiUrl, json=request_body, headers=headers)
        response.raise_for_status()
        response_data = response.json()

        resp = [
            candidate["content"]["parts"][0]["text"]
            for candidate in response_data["candidates"]
        ]
        # print(resp)
        return resp
