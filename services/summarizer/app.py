from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS  # Import CORS from flask_cors
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

model = AutoModelForSeq2SeqLM.from_pretrained('c:/Users/belal/Desktop/ai-summarizer/summarizer1')
tokenizer = AutoTokenizer.from_pretrained('c:/Users/belal/Desktop/ai-summarizer/summarizer1')
app = Flask(__name__)

# CORS(app)
cors_config = {
    "origins": ["http://127.0.0.1:5500", "https://isa-ai-summarizer.onrender.com"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}
CORS(app, resources={r"/api/v1/*": cors_config})

def summarize(text):
    inputs = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=2048, truncation=True)
    summary_ids = model.generate(inputs, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

@app.route('/api/v1/summarize', methods=['GET', 'POST'])  # Allow both GET and POST requests
def analyse():
    print("test")
    if request.method == 'POST':
        data = request.get_json()
        
        print(data)

        if data and 'paragraph' in data:
            paragraph = data['paragraph']

        print(paragraph)

        if paragraph:
            result = summarize(paragraph)
            print(result)
            return jsonify({'summary': result})
        else:
            return jsonify({'error': 'Missing paragraph data'}), 400
    else:
        return jsonify({'error': 'Unsupported method'}), 405

if __name__ == '__main__':
    app.run()
