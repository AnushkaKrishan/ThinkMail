import joblib
import re
from sklearn.base import BaseEstimator, TransformerMixin
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import nltk
from preprocessor import TextPreprocessor


nltk.download('stopwords')


# load the saved pipeline
pipeline = joblib.load('spam_pipeline.pkl')

def predict_spam(email_text):
    prediction = pipeline.predict([email_text])
    return "Spam" if prediction[0] == 1 else "Not Spam"



