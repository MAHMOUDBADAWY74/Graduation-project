import pandas as pd
import ftfy  # Library for fixing garbled text
from flask import Flask, render_template, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
import numpy as np
import time
import re
import traceback
from flask_cors import CORS

print("Script started: app.py")

# Function to fix garbled text
def fix_garbled_text(text):
    return ftfy.fix_text(text)

print("Starting data loading...")
start_time = time.time()

try:
    # Load the data
    print("Loading data...")
    df = pd.read_csv('Data Set/Main_Dataset_with_rating.csv', nrows=10000)  # Limit to 10000 rows

    # Clean the data
    print("Cleaning data...")
    df = df.dropna(subset=['title', 'author', 'text'])
    df['text'] = df['text'].fillna('')
    df['text'] = df['text'].apply(lambda x: x[:1000] if isinstance(x, str) else '')  # Limit text to 1000 characters

    # Prepare the texts
    print("Preparing texts...")
    texts = df['text'].tolist()
    texts = [text.lower() for text in texts]
    texts = [re.sub(r'[^\w\s]', '', text) for text in texts]

    # Convert texts to vectors using TF-IDF (faster than Word2Vec)
    print("Converting texts to vectors...")
    vectorizer = TfidfVectorizer(max_features=1000)
    text_vectors = vectorizer.fit_transform(texts)

    # Convert results to numpy array
    text_vectors = text_vectors.toarray()
    
    # Combine text vectors with feature vectors
    print("Combining vectors...")
    feature_vectors = np.hstack([text_vectors, df[['Rating']].values])

    # Calculate similarity matrix
    print("Calculating similarity matrix...")
    similarity_matrix = cosine_similarity(feature_vectors)

    print(f"Data loaded successfully. Number of rows: {len(df)}")
    print(f"Time taken to load: {time.time() - start_time:.2f} seconds")

    # Optimize TfidfVectorizer settings
    print("Setting up similarity model...")
    vectorizer = TfidfVectorizer(
        stop_words='english',
        max_features=2000,  # Reduce number of features
        ngram_range=(1, 2),
        max_df=0.95,
        min_df=2
    )

    # Convert texts to vectors
    print("Converting texts to vectors...")
    tfidf_matrix = vectorizer.fit_transform(df['text'])

    # Calculate similarity matrix
    print("Calculating similarity matrix...")
    similarity_matrix = cosine_similarity(tfidf_matrix)
    print("Similarity model setup successfully")

except Exception as e:
    print(f"Error during data loading: {str(e)}")
    traceback.print_exc()
    raise

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins (Access-Control-Allow-Origin: *)

# Search function using fuzzywuzzy
def get_best_match(input_title, titles):
    input_title = input_title.strip().lower()
    titles = titles.str.strip().str.lower()
    
    match, score, index = process.extractOne(input_title, titles)

    if score < 60:  # Return None if score is too low
        return None, None, None
    
    index_loc = titles[titles == match].index[0]
    return match, score, index_loc

def recommend_books(book_title, data, similarity_matrix):
    # Search by title first
    best_match, score, index = get_best_match(book_title, data['title'])
    
    if best_match is None:
        # Search in content if no title match found
        print(f"Searching in book content for: {book_title}")
        filtered_books = data[
            (data['text'].str.contains(book_title, case=False, na=False))
        ]

        recommendations = []
        for _, row in filtered_books.iterrows():
            # Calculate similarity with input text
            text_similarity = cosine_similarity(
                vectorizer.transform([book_title]),
                vectorizer.transform([row['text']])
            )[0][0]
            
            # Only include books with reasonable similarity
            if text_similarity > 0.1:  # Adjustable threshold
                recommendations.append({
                    'ID': row.get('id', None),
                    'title': row['title'],
                    'similarity': round(text_similarity * 100, 2),
                    'rating': float(row.get('Rating', 0)),
                    'cover': row.get('Cover', '') if pd.notna(row.get('Cover')) else ''
                })

        # Sort by similarity then rating
        recommendations = sorted(recommendations, key=lambda x: (x['similarity'], x['rating']), reverse=True)
        
        # Take top 10 recommendations
        recommendations = recommendations[:10]

        return None, recommendations, []

    # If title match found, use similarity matrix
    book_index = index
    similar_books = list(enumerate(similarity_matrix[book_index]))
    similar_books = sorted(similar_books, key=lambda x: x[1], reverse=True)[2:12]  # Take from 2nd to 11th recommendation

    recommendations = []
    for idx, sim_score in similar_books:
        row = data.iloc[idx]
        recommendations.append({
            'ID': row.get('id', None),
            'title': row['title'],
            'similarity': round(sim_score * 100, 2),
            'rating': float(row.get('Rating', 0)),
            'cover': row.get('Cover', '') if pd.notna(row.get('Cover')) else ''
        })

    return best_match, recommendations, []

# Home page and results display
@app.route('/')
def index():
    return render_template('index.html')

# Book search page
@app.route('/recommend', methods=['POST'])
def recommend():
    book_title = request.form['book_title']
    best_match, recommendations, suggestions = recommend_books(book_title, df, similarity_matrix)

    return render_template(
        'recommendations.html',
        best_match=best_match,
        recommendations=recommendations,
        suggestions=suggestions,
        original_title=book_title  # Pass the input term
    )

# Book details page
@app.route('/book/<int:book_id>')
def book_details(book_id):
    try:
        book = df.loc[df['id'] == book_id].iloc[0]
        print(f"Debug - Book data: {book.to_dict()}")  # Debug line
        
        # Ensure cover image exists
        cover_url = book.get('Cover', '')
        if pd.isna(cover_url) or cover_url == '':
            cover_url = 'https://via.placeholder.com/300x450?text=No+Cover'
            
        book_data = {
            'title': book['title'] if pd.notna(book['title']) else 'Title not available',
            'author': book['author'].strip("'") if pd.notna(book['author']) else 'Unknown author',  # Remove quotes from author name
            'rating': float(book['Rating']) if pd.notna(book['Rating']) else 0.0,
            'category': book['Category'] if pd.notna(book['Category']) else 'Not specified',  # Fixed category column name
            'language': 'English',
            'summary': book['Summary'] if pd.notna(book['Summary']) else 'No description available',  # Fixed summary column name
            'cover': cover_url.strip("'") if pd.notna(cover_url) else 'https://via.placeholder.com/300x450?text=No+Cover'  # Remove quotes from cover URL
        }
        print(f"Debug - Processed book data: {book_data}")  # Debug line
        return render_template('book_details.html', book=book_data)
    except Exception as e:
        print(f"Error in book_details: {str(e)}")
        return render_template('book_details.html', book={})

@app.route('/api/recommend', methods=['POST'])
def api_recommend():
    data = request.get_json()
    if not data or 'term' not in data:
        return jsonify({'error': 'No search term provided'}), 400
    term = data['term']
    _, recommendations, _ = recommend_books(term, df, similarity_matrix)
    def to_native(rec):
        return {
            'id': int(rec['ID']) if rec['ID'] is not None else None,
            'title': str(rec['title']),
            'similarity': float(rec['similarity']),
            'rating': float(rec['rating']),
            'cover': str(rec['cover'])
        }
    recommendations_native = [to_native(rec) for rec in recommendations]
    return jsonify(recommendations_native)

if __name__ == '__main__':
    print("Starting the application...")
    app.run(debug=True)