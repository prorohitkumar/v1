GOOGLE_API_KEY = "AIzaSyAQ4j-3ZaKNZQzcPevVCIlPwqNPssQgHIo"

config = {
    'temperature': 0,
    'top_k': 20,
    'top_p': 0.9,
    'max_output_tokens': 2048
}

SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
]


