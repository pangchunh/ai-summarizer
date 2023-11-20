const analyzeButton = document.getElementById('analyzeButton');
        const inputText = document.getElementById('inputText');
        const result = document.getElementById('labelResult');

        analyzeButton.addEventListener('click', async () => {
    const paragraph = inputText.value;
    if (paragraph) {
        const body = {"paragraph": paragraph}
        
        // Send a POST request with the text as a query parameter
        const res = await fetch(`http://127.0.0.1:5000/api`, {
            headers:{"Content-Type": "application/json"},
            method: "POST",
            body:JSON.stringify(body)})

        const data = await res.json()
        result.innerHTML = data.summary
    } else {
        result.textContent = 'Please enter a paragraph to analyze.';
    }
});

//logout function
document.getElementById('logout').addEventListener('click', async () => {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  window.location.href = '/'
}
)
