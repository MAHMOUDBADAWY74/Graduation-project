from flask import Flask, request, render_template, send_from_directory, jsonify
import os
import time
from googletrans import Translator
from gtts import gTTS
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure the static/audio directory exists
audio_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "audio")
if not os.path.exists(audio_dir):
    os.makedirs(audio_dir)

# Supported languages for gTTS (partial list, can be expanded)
SUPPORTED_LANGUAGES = {'en', 'ar', 'fr', 'es', 'de', 'it', 'ja', 'zh-cn'}

# الصفحة الرئيسية - لتحويل النص إلى كلام
@app.route("/", methods=["GET", "POST"])
def index():
    audio_path_relative = None
    selected_target_lang = "en"
    conversion_time = None
    error_message = None
    input_text = ""

    if request.method == "POST":
        if request.form.get("text_input"):
            input_text = request.form["text_input"]
            selected_target_lang = request.form["lang"]
            start_time = time.time()
            try:
                translator = Translator()  # Fixed: Initialize Translator object
                translated = translator.translate(input_text, dest=selected_target_lang)
                translated_text = translated.text

                tts = gTTS(text=translated_text, lang=selected_target_lang, slow=False)
                audio_filename = f"output_{int(time.time())}.mp3"
                audio_save_path = os.path.join(audio_dir, audio_filename)
                tts.save(audio_save_path)
                audio_path_relative = f"audio/{audio_filename}"
                conversion_time = round(time.time() - start_time, 2)

            except Exception as e:
                error_message = f"حدث خطأ أثناء الترجمة أو تحويل النص إلى كلام: {e}"
                print(f"Error: {e}")
        else:
            pass

    return render_template("index.html",
                           audio_path_relative=audio_path_relative,
                           conversion_time=conversion_time,
                           selected_target_lang=selected_target_lang,
                           input_text=input_text,
                           error_message=error_message)

# دالة للوصول لملف الصوت
@app.route("/static/audio/<path:filename>")
def get_audio(filename):
    if '..' in filename or filename.startswith('/'):
        return jsonify({"error": "اسم ملف غير صالح"}), 400
    return send_from_directory(audio_dir, filename)

# API endpoint لتحويل النص إلى كلام (معدل لإرجاع audio_path فقط)
@app.route("/api/tts", methods=["POST"])
def text_to_speech_api():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "النص مطلوب"}), 400

        input_text = data['text'].strip()
        selected_target_lang = data.get('lang', 'en').lower()

        # التحقق من صحة البيانات
        if not input_text:
            return jsonify({"error": "النص لا يمكن أن يكون فارغًا"}), 400
        if len(input_text) > 5000:
            return jsonify({"error": "النص طويل جدًا، الحد الأقصى 5000 حرف"}), 400
        if selected_target_lang not in SUPPORTED_LANGUAGES:
            return jsonify({"error": f"اللغة غير مدعومة: {selected_target_lang}. اللغات المدعومة: {', '.join(SUPPORTED_LANGUAGES)}"}), 400

        # تنظيف النص من الحاجات اللي ممكن تكون خطرة
        input_text = re.sub(r'[<>]', '', input_text)

        # ترجمة النص
        translator = Translator()
        translated = translator.translate(input_text, dest=selected_target_lang)
        translated_text = translated.text

        # تحويل النص المترجم إلى صوت
        tts = gTTS(text=translated_text, lang=selected_target_lang, slow=False)
        audio_filename = f"output_{int(time.time() * 1000)}.mp3"  # اسم ملف بدقة أعلى
        audio_save_path = os.path.join(audio_dir, audio_filename)
        tts.save(audio_save_path)

        # إرجاع مسار الصوت فقط
        audio_url = f"/static/audio/{audio_filename}"
        return jsonify({"audio_path": audio_url})

    except Exception as e:
        return jsonify({"error": f"حصل خطأ: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)