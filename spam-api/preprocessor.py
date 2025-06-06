import re
from sklearn.base import BaseEstimator, TransformerMixin
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

class TextPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.ps = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))

    def preprocess(self, text):
        review = re.sub('[^a-zA-Z]', ' ', text)
        review = review.lower().split()
        review = [self.ps.stem(word) for word in review if word not in self.stop_words]
        return ' '.join(review)

    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        return [self.preprocess(text) for text in X]
