import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
import ftfy  # مكتبة إصلاح النصوص

# دالة إصلاح النصوص المشوهة
def fix_garbled_text(text):
    return ftfy.fix_text(text)

# تحميل البيانات بشكل جزئي باستخدام chunksize
dtype = {'Title': str, 'Category': str, 'Author': str}
chunk_size = 10000  # حجم كل جزء من البيانات
chunks = pd.read_csv('C:/Users/BADAWY/Desktop/GP- Project/Data Set/Main_Final_with_user_data.csv', encoding='utf-8-sig', chunksize=chunk_size, low_memory=False)

# قائمة لتخزين الأجزاء المعدلة
df_list = []

# معالجة البيانات في كل جزء بشكل منفصل
for chunk in chunks:
    # إصلاح النصوص المشوهة في الأعمدة
    chunk['Title'] = chunk['Title'].apply(fix_garbled_text)
    chunk['Author'] = chunk['Author'].apply(fix_garbled_text)
    chunk['Category'] = chunk['Category'].apply(fix_garbled_text)
    
    # تنظيف البيانات (إزالة القيم الفارغة)
    chunk = chunk.dropna(subset=['Title', 'Category', 'Author'])
    
    # التأكد من تحويل الأعمدة إلى نوع str قبل الدمج
    chunk['Title'] = chunk['Title'].astype(str)
    chunk['Category'] = chunk['Category'].astype(str)
    chunk['Author'] = chunk['Author'].astype(str)
    
    # دمج عدة ميزات نصية (عنوان الكتاب، التصنيف، المؤلف)
    chunk['combined_features'] = chunk['Title'] + ' ' + chunk['Category'] + ' ' + chunk['Author']
    
    # إضافة الجزء المعدل إلى القائمة
    df_list.append(chunk)

# دمج الأجزاء في DataFrame واحد
df = pd.concat(df_list, ignore_index=True)

# إعداد الـ TfidfVectorizer
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df['combined_features'])

# حساب مصفوفة التشابه
similarity_matrix = cosine_similarity(tfidf_matrix)

# دالة البحث باستخدام fuzzywuzzy
def get_best_match(input_title, titles):
    input_title = input_title.strip().lower()
    titles = titles.str.strip().str.lower()
    
    match, score, index = process.extractOne(input_title, titles)

    if score < 60:  # لو السكور ضعيف نرجع None
        return None, None, None
    
    index_loc = titles[titles == match].index[0]
    return match, score, index_loc


def recommend_books(book_title, data, similarity_matrix):
    best_match, score, index = get_best_match(book_title, data['Title'])
    
    if best_match is None:
        filtered_books = data[data['combined_features'].str.contains(book_title, case=False, na=False)]

        recommendations = []
        for _, row in filtered_books.iterrows():
            recommendations.append({
                'ID': row.get('ID', None),
                'title': row['Title'],
                'similarity': 100,
                'cover': row.get('Cover', ''),
                'rating': row.get('Rating', 0)  # 0 إذا مفيش تقييم
            })

        # الترتيب حسب التقييم
        recommendations = sorted(recommendations, key=lambda x: x['rating'], reverse=True)

        return None, recommendations, []

    book_index = index

    similar_books = list(enumerate(similarity_matrix[book_index]))
    similar_books = sorted(similar_books, key=lambda x: x[1], reverse=True)[1:10]

    recommendations = []
    for idx, sim_score in similar_books:
        row = data.iloc[idx]
        recommendations.append({
            'ID': row.get('ID', None),
            'title': row['Title'],
            'similarity': round(sim_score, 2),
            'cover': row.get('Cover', ''),
            'rating': row.get('Rating', 0)  # إضافة التقييم
        })

    # الترتيب حسب التقييم (تنازليًا)
    recommendations = sorted(recommendations, key=lambda x: x['rating'], reverse=True)

    return best_match, recommendations, []


# دالة الشات بوت
def chatbot():
    print("Welcome to the Book Recommender Chatbot!")
    
    # تأكد من تحميل البيانات المطلوبة هنا
    data = df  # البيانات الخاصة بالكتب
    similarity_matrix = cosine_similarity(tfidf_matrix)  # مصفوفة التشابه
    
    while True:
        user_input = input("Enter a book title you like (or type 'exit' to quit): ")
        if user_input.lower() == 'exit':
            print("Goodbye! Happy reading!")
            break
        
        # تمرير المعاملات المطلوبة للدالة
        best_match, recommendations, _ = recommend_books(user_input, data, similarity_matrix)
        
        print("\nRecommended books:")
        if recommendations:
            for book in recommendations:
                print(f"- {book['title']}")
        else:
            print("No recommendations found.")
        print()

# Run the chatbot
chatbot()
