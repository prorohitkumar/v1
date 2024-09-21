import logging
import requests
from main.config_case_study_creator import Config
from main.models_case_study_creator import CaseStudyRequest
from jinja2 import Environment, FileSystemLoader

# Configure logging
logger = logging.getLogger(__name__)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
file_handler = logging.FileHandler('case_study_creator.log')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)
logger.setLevel(logging.INFO)

# Initialize Jinja2 environment
env = Environment(loader=FileSystemLoader('./templates'))

class CaseStudyService:
    def __init__(self):
        self.base_url = Config.GEMINI_BASE_URL

    async def generate_case_study(self, data: CaseStudyRequest):
        # Construct prompt using user input
        template = env.get_template('case_study_creator_prompt_template.jinja')
        prompt = template.render(data)

        headers = {'Content-Type': 'application/json'}
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

        try:
            response = requests.post(self.base_url, json=request_body, headers=headers)
            response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)


            answer = response.json().get("candidates")[0].get("content").get("parts")[0].get("text")
            return answer
        except requests.RequestException as e:
            logger.error(f"Failed to generate case study: {e}")
            raise ValueError("Failed to generate case study due to a request exception.")
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            raise ValueError("An unexpected error occurred while generating the case study.")