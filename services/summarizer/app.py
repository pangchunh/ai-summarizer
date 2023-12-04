from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS  # Import CORS from flask_cors

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
app = Flask(__name__)

# CORS(app)
cors_config = {
    "origins": ["http://127.0.0.1:5500", "https://isa-ai-summarizer.onrender.com"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}
CORS(app, resources={r"/api/v1/*": cors_config})

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
            result = summarizer(paragraph, max_length=130, min_length=30, do_sample=False)
            return jsonify({'summary': result[0]['summary_text']})
        else:
            return jsonify({'error': 'Missing paragraph data'}), 400
    else:
        return jsonify({'error': 'Unsupported method'}), 405

if __name__ == '__main__':
    app.run()
