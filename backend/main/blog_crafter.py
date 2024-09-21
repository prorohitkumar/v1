import markdown
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import httplib2
from oauth2client.client import flow_from_clientsecrets
from oauth2client.file import Storage
from oauth2client.tools import run_flow
from googleapiclient import discovery
from main.config import API_KEY

import logging

# configuring google.generativeai with API key
genai.configure(api_key=API_KEY)

config = {"temperature": 0, "top_k": 20, "top_p": 0.9, "max_output_tokens": 1048576}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-latest",
    generation_config=config,
)

input_text = ""


def authorize_credentials():
    CLIENT_SECRET_FILE = "./credentials.json"
    SCOPE = "https://www.googleapis.com/auth/blogger"
    STORAGE_FILE = "./creds.storage"

    storage = Storage(STORAGE_FILE)
    credentials = storage.get()

    if credentials is None or credentials.invalid:
        try:
            logging.info("Check for google credentials")
            flow = flow_from_clientsecrets(CLIENT_SECRET_FILE, scope=SCOPE)
            credentials = run_flow(flow, storage, http=httplib2.Http())
        except Exception as e:
            logging.error(f"Error while obtaining credentials: {e}")
            print(f"Error obtaining credentials: {e}")
            credentials = None

    return credentials
