---
tags: autotrain
language: en
widget:
- text: "I love AutoTrain 🤗"
datasets:
- faisalahmad/autotrain-data-nsut-nlp-project-textsummarization
co2_eq_emissions: 736.9366247330848
---

# Model Trained Using AutoTrain

- Problem type: Summarization
- Model ID: 791824379
- CO2 Emissions (in grams): 736.9366247330848

## Validation Metrics

- Loss: 1.7805895805358887
- Rouge1: 37.8222
- Rouge2: 16.7598
- RougeL: 31.2959
- RougeLsum: 31.3048
- Gen Len: 19.7213

## Usage

You can use cURL to access this model:

```
$ curl -X POST -H "Authorization: Bearer YOUR_HUGGINGFACE_API_KEY" -H "Content-Type: application/json" -d '{"inputs": "I love AutoTrain"}' https://api-inference.huggingface.co/faisalahmad/autotrain-nsut-nlp-project-textsummarization-791824379
```