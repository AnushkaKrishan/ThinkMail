import joblib
import re
from sklearn.base import BaseEstimator, TransformerMixin
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import nltk
from preprocessor import TextPreprocessor
from fastapi import FastAPI, Form, Request
from fastapi.responses import JSONResponse
import joblib
import nltk

nltk.download('stopwords')

app = FastAPI()

# Load the saved pipeline
pipeline = joblib.load('spam_pipeline.pkl')

@app.post("/predict")
async def predict_spam_endpoint(email_text: str = Form(...)):
    prediction = pipeline.predict([email_text])
    result = "Spam" if prediction[0] == 1 else "Not Spam"
    return JSONResponse(content={"prediction": result})






