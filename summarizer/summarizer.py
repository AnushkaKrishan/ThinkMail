import os
import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel

# Read API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

app = FastAPI()

class EmailRequest(BaseModel):
    email: str

@app.post("/summarize")
async def summarize_email(request: EmailRequest):
    prompt = f"""
    Determine the following from the email:
    1. The sender
    2. The sender's role
    3. The overall tone
    4. A concise summary (max 4 lines)

    Email:
    {request.email}
    """
    response = model.generate_content(prompt)
    return {"summary": response.text}