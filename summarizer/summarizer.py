import os
import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel

# Read API key from environment variable
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

app = FastAPI()

class EmailBatchRequest(BaseModel):
    emails: list[str]


class SummaryResponse(BaseModel):
    summaries: list[str]

@app.post("/summarize",response_model=SummaryResponse)
async def summarize_email(request: EmailBatchRequest):
    summaries = []
    for email in request.emails:
     prompt = f"""
     Determine the following from the email:
     1. The sender
     2. The sender's role
     3. The overall tone
     4. A concise summary (max 4 lines)

     Email:
     {email}
    """
    response = model.generate_content(prompt)
    summaries.append(response.text.strip())  # Strip extra whitespace
    return {"summaries": summaries}
    


