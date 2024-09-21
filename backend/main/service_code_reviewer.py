import json
import re
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from main.config import API_KEY

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


class CodeReviewer:
    def __init__(self):
        self.api_key = API_KEY

    def generate_review(self, code):
        try:
            prompt = (
                f"Act as an expert code reviewer. Analyze the following code:\n\n{code}\n\n"
                "Report your observations on the following parameters in detail:\n"
                "1. Code Issues: Identify any logical errors, type errors, runtime errors, and syntax errors.\n"
                "2. Performance and Optimization Issues: Highlight potential bottlenecks, inefficient algorithms, and suboptimal practices affecting performance. Include issues with time and space complexity, loops, data structures, memory management, SQL queries, I/O operations, object creation, garbage collection, memory leaks, concurrency, parallelism, and thread management.\n"
                "3. Security Vulnerabilities: Look for OWASP 10 vulnerabilities such as injection, broken access control, cryptographic failures, sensitive data exposure, XXS, XXE, insecure deserialization, and any other security concerns. Check for user inputs that are not validated, hardcoded credentials, and logging of sensitive information.\n"
                "4. Scalability Issues: Identify inefficient database queries, improper indexing, unoptimized query plans, resource management issues, and caching problems.\n"
                "5. Engineering Practices: Check for adherence to coding standards, meaningful naming conventions, proper commenting and documentation, modularity, separation of concerns, use of design patterns, and proper error handling.\n"
                "For each issue, provide a description and criticality level (1-5), and suggest refactored code if applicable.\n"
                "Return the response in the following JSON format:\n"
                "{"
                '  "codeIssues": ['
                '    {"issueType": "Logical error", "description": "", "criticalityLevel": 3},'
                '    {"issueType": "Runtime error", "description": "", "criticalityLevel": 2}'
                "  ],"
                '  "performanceOptimizationIssues": ['
                '    {"issueType": "Unoptimized Time and Space Complexity of Algorithms", "description": "", "criticalityLevel": 1},'
                '    {"issueType": "Unoptimized use of Loops", "description": "POxyz", "criticalityLevel": 2}'
                "  ],"
                '  "securityVulnerabilityIssues": ['
                '    {"issueType": "OWASP 10 security vulnerabilities", "description": "", "criticalityLevel": 3},'
                '    {"issueType": "hardcoded credentials or API keys in code", "description": "", "criticalityLevel": 4}'
                "  ],"
                '  "scalabilityIssues": ['
                '    {"issueType": "Inefficient use of database queries", "description": "", "criticalityLevel": 5},'
                '    {"issueType": "improper indexing", "description": "", "criticalityLevel": 1}'
                "  ],"
                '  "engineeringPracticesIssues": ['
                '    {"issueType": "Non-adherence to coding standards", "description": "", "criticalityLevel": 3},'
                '    {"issueType": "non-meaningful and non-descriptive constructs", "description": "", "criticalityLevel": 4}'
                "  ],"
                '  "refactoredCode": "refactored/updated/correct code. Return only the code in the format of the language. Do not return in markdown format. Do not add any explanation to the refactored code. "'
                "}"
                "If no issues are found, return an empty array for each parameter."
            )

            response = model.generate_content(
                prompt,
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                },
            )

            if response and response.parts:
                generated_review = response.parts[0].text
                json_match = re.search(
                    r'\{.*"refactoredCode":', generated_review, re.DOTALL
                )
                if json_match:
                    json_str = json_match.group() + '""}'

                    try:
                        review_dict = json.loads(json_str)
                        refactored_code_match = re.search(
                            r'"refactoredCode":(.*)$', generated_review, re.DOTALL
                        )
                        if refactored_code_match:
                            refactored_code = refactored_code_match.group(1).strip()[
                                1:-1
                            ]
                            review_dict["refactoredCode"] = refactored_code.replace(
                                "\\n", "\n"
                            )
                        return review_dict
                    except json.JSONDecodeError as e:
                        return {
                            "error": "Error decoding JSON response",
                            "raw_response": json_str,
                        }
                else:
                    return {
                        "error": "No JSON found in response",
                        "raw_response": generated_review,
                    }
            else:
                return {
                    "error": "Unexpected response format",
                    "raw_response": str(response),
                }

        except Exception as e:
            return {"error": f"Error generating review: {e}"}


class CodeAssistant:
    def __init__(self):
        self.api_key = API_KEY

    def generate_response(self, code, user_prompt):
        try:
            prompt = (
                f"Act as a code assistant. Your task is to help users with code-related queries.\n"
                f"The code that you need to refer to is the following: {code}\n"
                f"The user Prompt that you need to answer is: {user_prompt}\n"
                f"If the user prompt is not related to the code reply back saying 'Please enter a valid query related to the code'\n"
                f'{{\n  "Response": "provide your response to the prompt"\n}}'
            )

            response = model.generate_content(
                prompt,
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                },
            )

            if response and response.parts:
                generated_response = (
                    response.parts[0]
                    .text.replace("```json\n", "")
                    .replace("```", "")
                    .strip()
                )
                try:
                    return json.loads(generated_response)
                except json.JSONDecodeError as e:
                    return {
                        "error": "Error decoding JSON response",
                        "raw_response": generated_response,
                    }
            else:
                return {
                    "error": "Unexpected response format",
                    "raw_response": str(response),
                }

        except Exception as e:
            return {"error": f"Error generating response: {e}"}
