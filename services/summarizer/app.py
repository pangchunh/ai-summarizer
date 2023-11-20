from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS  # Import CORS from flask_cors

summarizer = pipeline("summarization", model="facebook/bart-base")
app = Flask(__name__)

CORS(app)

@app.route('/api/v1/summarize', methods=['GET', 'POST'])  # Allow both GET and POST requests
def analyse():
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
