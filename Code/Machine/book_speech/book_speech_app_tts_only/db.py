import sqlite3
from datetime import datetime

# إنشاء قاعدة البيانات وإنشاء جدول جديد إذا لم يكن موجودًا
def create_db():
    conn = sqlite3.connect("transcripts.db")
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        timestamp TEXT
    )
    """)
    conn.commit()
    conn.close()

# إضافة نص محول إلى قاعدة البيانات
def add_transcript(content):
    conn = sqlite3.connect("transcripts.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO transcripts (content, timestamp) VALUES (?, ?)",
                   (content, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

# استرجاع جميع التحويلات
def get_all_transcripts():
    conn = sqlite3.connect("transcripts.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transcripts ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return rows

# إحصائيات التحويلات
def get_stats():
    conn = sqlite3.connect("transcripts.db")
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*), SUM(LENGTH(content)) FROM transcripts")
    count, total_chars = cursor.fetchone()
    conn.close()
    word_count = int(total_chars / 5) if total_chars else 0  # تقدير تقريبي
    return count, word_count

# حذف تحويل معين
def delete_transcript(id):
    conn = sqlite3.connect("transcripts.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transcripts WHERE id = ?", (id,))
    conn.commit()
    conn.close()

# حذف كل التحويلات
def delete_all_transcripts():
    conn = sqlite3.connect("transcripts.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transcripts")
    conn.commit()
    conn.close()
