from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load model and tokenizer from the local directory
model = AutoModelForSeq2SeqLM.from_pretrained('c:/Users/belal/Desktop/ai-summarizer/summarizer1')
tokenizer = AutoTokenizer.from_pretrained('c:/Users/belal/Desktop/ai-summarizer/summarizer1')

# Function to summarize text
def summarize(text):
    inputs = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(inputs, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# Example usage
# text = """
#  I have bought several of the Vitality canned dog food products and have found them all to be of good quality. The product looks more like a stew than a processed meat and it smells better. My Labrador is finicky and she appreciates this product better than most."""
# print(summarize(text))