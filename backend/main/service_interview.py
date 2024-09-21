import requests
import json
import logging

class ChatService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.api_key}"

    async def get_interview_questions(self, domain, role, difficulty_level, specific_topic, num_questions=15):
        try:
            headers = {'Content-Type': 'application/json'}
            logging.info(f"Generate {num_questions} interview questions on {specific_topic} with level {difficulty_level}.")
            prompt = f"You are a {role} in the {domain} domain preparing interview questions."

            prompt += f"\n\nGenerate {num_questions} interview questions along with answers for the topic of {specific_topic} with difficulty level {difficulty_level}."
            prompt += f"\nOut of these, include 3-5 scenario-based questions."
            prompt += f"\nProvide direct answers without suggestions or advice. Give the answer in first person."
            prompt += f"\nReturn your response in an array of JSON objects. Each object will have 'question' and 'answer' keys."
            prompt += f"\nBelow is the example structure that you should return your response:"
            prompt += '''[
              {
                "question": "What is @SpringBootApplication annotation used for in Spring Boot?",
                "answer": "The @SpringBootApplication annotation is used to mark a class as the main Spring Boot application class and is typically placed on the main class of the application."
              },
              {
                "question": "Explain the concept of dependency injection in Spring Boot.",
                "answer": "Dependency injection is a technique where an object is given its dependencies by external code rather than creating them itself."
              },
              {
                "question": "You encounter a circular dependency issue in a Spring Boot project. How would you resolve it?",
                "answer": "One way to resolve a circular dependency issue in Spring Boot is by using constructor injection instead of field injection. This allows dependencies to be injected via constructor parameters, avoiding the circular reference problem."
              },
              {
                "question": "You are tasked with optimizing the performance of a Spring Boot application. What steps would you take?",
                "answer": "To optimize the performance of a Spring Boot application, I will analyze and optimize database queries, implement caching mechanisms, and utilize asynchronous processing where applicable."
              },
              {
                "question": "In a Spring Boot application, how do you handle data validation using the Bean Validation API?",
                "answer": "To utilize the Bean Validation API for data validation, I will add the 'hibernate-validator' dependency and annotate data fields with constraints defined in the javax.validation package. Spring Boot will automatically perform validation during object creation, providing detailed error messages for invalid data."
              },
              {
                "question": "You are working on a Spring Boot application that uses an in-memory database. What steps would you take to ensure data persistence across application restarts?",
                "answer": "To ensure data persistence in Spring Boot applications using an in-memory database, I will consider implementing a data persistence mechanism such as using a persistent database (e.g., MySQL, PostgreSQL) or incorporating a caching solution (e.g., Redis, Memcached) to store data."
              }
            ]'''

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

            response = requests.post(self.base_url, json=request_body, headers=headers)
            response.raise_for_status()  # Raise an error if the request was unsuccessful

            response_data = response.json()

            generated_questions = []

            for candidate in response_data['candidates']:
                question_answer_pairs = json.loads(candidate['content']['parts'][0]['text'])
                for pair in question_answer_pairs:
                    generated_questions.append({'question': pair['question'], 'answer': pair['answer']})

            return generated_questions[:num_questions]  # Return only the first num_questions

        except Exception as e:
            logging.error(f"Error in generating interview question: {str(e)}")
            print("Service Exception:", str(e))
            raise Exception("Error in getting response from Gemini API")
