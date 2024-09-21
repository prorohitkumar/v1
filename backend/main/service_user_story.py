import requests
import json
from main.config import GENERATION_CONFIG, API_KEY
import logging

class UserStoriesService:

    @staticmethod
    def generate_user_story(prompt: str):
        apiUrl = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}"

        headers = {"Content-Type": "application/json"}
        generation_config = GENERATION_CONFIG

        request_body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": generation_config,
        }

        try:
            response = requests.post(apiUrl, json=request_body, headers=headers)
            response.raise_for_status()
            response_data = response.json()

            if "candidates" not in response_data:
                logging.error(f"Unexpected response format: {response_data}")
                raise ValueError("The response does not contain the expected 'candidates' key")

            generated_questions = []
            for candidate in response_data["candidates"]:
                if "content" not in candidate or "parts" not in candidate["content"] or not candidate["content"]["parts"]:
                    logging.error(f"Unexpected candidate format: {candidate}")
                    raise ValueError("The candidate does not contain the expected 'content' structure")

                question_answer_pairs = json.loads(candidate["content"]["parts"][0]["text"])
                for pair in question_answer_pairs:
                    if "userStory" not in pair:
                        logging.error(f"Unexpected pair format: {pair}")
                        raise ValueError("The pair does not contain the expected 'userStory' key")
                    generated_questions.append({"userStory": pair["userStory"]})

            return generated_questions

        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed: {str(e)}")
            raise RuntimeError("Failed to communicate with the user story generation API") from e

        except ValueError as e:
            logging.error(f"Data processing error: {str(e)}")
            raise RuntimeError("Failed to process the response from the user story generation API") from e

        except json.JSONDecodeError as e:
            logging.error(f"JSON decoding error: {str(e)}")
            raise RuntimeError("Failed to decode the JSON response from the user story generation API") from e
