import requests
import json
import os
import logging
from Markdown2docx import Markdown2docx
from main.config import API_URL, API_KEY, GENERATION_CONFIG, SAFETY_SETTINGS  # Imports configuration settings


# Load configuration
working_dir = os.path.dirname(os.path.abspath(__file__))
# config_file_path = os.path.join(working_dir, "config.json")
# with open(config_file_path) as config_file:
    # config_data = json.load(config_file)
GOOGLE_API_KEY = API_KEY

class RolePlayCreator:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.api_key}"

    @staticmethod
    def construct_prompt(data):
        logging.info(f"Create a role play with data: {data}")
        prompt_parts = [
            "Generate a role-play exercise with the following specifications:\n",
            f"**Industry:** {data['industry']}\n",
            f"**Learning Objective:** {data['learningObjective']}\n",
            "**Roles:**\n"
        ]
        prompt_parts.extend([f"- {role}\n" for role in data['roles']])
        prompt_parts.append("**Required Skills:**\n")
        prompt_parts.extend([f"- {skill}\n" for skill in data['skills']])

        if 'complexity' in data:
            prompt_parts.append(f"**Complexity:** {data['complexity']}\n")

        if 'experience' in data:
            prompt_parts.append(f"**Experience Level:** {data['experience']}\n")

        if 'industryContext' in data:
            prompt_parts.append(f"**Industry Context:** {data['industryContext']}\n")

        if 'scenarioSettings' in data:
            prompt_parts.append(f"**Scenario Settings:** {data['scenarioSettings']}\n")

        return ''.join(prompt_parts)

rolePlayCreator_service = RolePlayCreator(api_key=GOOGLE_API_KEY)

async def generate_role_play(data):
    try:
        prompt = rolePlayCreator_service.construct_prompt(data)
        generation_config = {
            'temperature': 0.9,
            'topK': 1,
            'topP': 1,
            'maxOutputTokens': 2048,
            'stopSequences': []
        }

        request_body = {
            'contents': [{'parts': [{'text': prompt}]}],
            'generationConfig': generation_config
        }

        response = requests.post(rolePlayCreator_service.base_url, json=request_body, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        response_data = response.json()
        role_play_exercise = [candidate['content']['parts'][0]['text'] for candidate in response_data['candidates']]

        return role_play_exercise

    except Exception as e:
        logging.error(f"Exception while generating a role play: {str(e)}")
        raise Exception("Error in getting response from Gemini API")

async def generate_docx(markdown_content):
    try:
        file_path = os.path.join(working_dir, "RolePlay")
        create_md_file(markdown_content, file_path)
        project = Markdown2docx(file_path)
        project.eat_soup()
        project.save()
        return os.path.join(working_dir, "RolePlay.docx")
    except Exception as e:
        logging.error(f"Error generating DOCX file: {str(e)}")
        raise Exception("Error generating DOCX file")

def create_md_file(text_content, file_path):
    try:
        with open(file_path, 'w') as f:
            f.write(text_content)
        logging.info(f"Markdown file '{file_path}' created successfully.")
    except Exception as e:
        logging.error(f"Error: {str(e)}")
