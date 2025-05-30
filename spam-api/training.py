import pandas as pd
import re
import nltk
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.base import BaseEstimator, TransformerMixin
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from sklearn.metrics import accuracy_score, confusion_matrix
from preprocessor import TextPreprocessor
import joblib


# Download stopwords
nltk.download('stopwords')

# Load dataset
spam = pd.read_csv('spam (1).csv', encoding='latin-1')
spam = spam[['v1', 'v2']]
spam.columns = ['label', 'message']

# Labels (1 = spam, 0 = ham)
y = spam['label'].map({'ham': 0, 'spam': 1}).values



# Create pipeline
pipeline = make_pipeline(
    TextPreprocessor(),
    CountVectorizer(max_features=4000),
    MultinomialNB()
)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(spam['message'], y, test_size=0.2, random_state=42)

# Train model
pipeline.fit(X_train, y_train)

# Evaluate
y_pred = pipeline.predict(X_test)
print(confusion_matrix(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save the pipeline
joblib.dump(pipeline, 'spam_pipeline.pkl')
print("Model saved to spam_pipeline.pkl")

# --- Usage Example ---
def predict_spam(email_text):
    prediction = pipeline.predict([email_text])
    return "Spam" if prediction[0] == 1 else "Not Spam"

# Test
email_1 = "Congratulations! You've won a free iPhone. Click here to claim now."
email_2 = "Hey, are we still meeting for dinner tonight?"

print(f"Email 1 is: {predict_spam(email_1)}")
print(f"Email 2 is: {predict_spam(email_2)}")