const analyzeButton = document.getElementById("analyzeButton");
const inputText = document.getElementById("inputText");
const result = document.getElementById("labelResult");
const summaryContainer = document.getElementById("summaryContainer");

analyzeButton.addEventListener("click", async () => {
	const paragraph = inputText.value;
	if (paragraph) {
		const body = { paragraph: paragraph };

		// Send a POST request with the text as a query parameter
		const res = await fetch(
			`https://547b-99-199-61-101.ngrok-free.app/api/v1/summarize`,
			{
				headers: { "Content-Type": "application/json" },
				method: "POST",
				body: JSON.stringify(body),
			}
		);

		const data = await res.json();
		console.log(data.summary);
		result.textContent = data.summary;

		// Unhide the summary container
		summaryContainer.style.display = "block";
	} else {
		result.textContent = "Please enter a paragraph to analyze.";
		// Keep the summary container hidden
		summaryContainer.style.display = "none";
	}
});
//logout function
document.getElementById("logout").addEventListener("click", async () => {
	document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	window.location.href = "/";
});
