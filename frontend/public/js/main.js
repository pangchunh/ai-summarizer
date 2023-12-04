const analyzeButton = document.getElementById("analyzeButton");
const inputText = document.getElementById("inputText");
const result = document.getElementById("labelResult");
const summaryContainer = document.getElementById("summaryContainer");
const host = "https://isa-ai-summarizer.onrender.com";
// const host = "http://localhost:3001"
// const ml_host = "https://1e58-99-199-61-101.ngrok-free.app"

analyzeButton.addEventListener("click", async () => {
	const paragraph = inputText.value;
	if (paragraph) {
		const body = { paragraph };

		// Send a POST request with the text as a query parameter
		try{
			const res = await fetch(
				`${host}/api/v1/summarize`,
				{
					headers: { "Content-Type": "application/json" },
					method: "POST",
					body: JSON.stringify(body),
					credentials: "include",
				}
			);
			const data = await res.json();
			if (res.status === 200) {
				result.textContent = data.data.summary;
			} 
			else {
				throw new Error(data.message)
			}
			// Unhide the summary container
			summaryContainer.style.display = "block";
			//add 1 to the api call count
			await getUserApiCount()
		}catch(err){
			console.log("Caught error")
			result.textContent = err;
			summaryContainer.style.display = "block";

		}
		
	} else {
		result.textContent = "Please enter a paragraph to analyze.";
		// Keep the summary container hidden
		summaryContainer.style.display = "none";
	}
});

//display user api call count by calling api/v1/get-user-api-count

async function getUserApiCount() {
	const result = await fetch(`${host}/api/v1/get-user-api-count`, {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		},
		credentials: 'include',
	  })
	const {data} = await result.json()
	const {count, max_count} = data
	document.getElementById('apicalls').innerText = count
	document.getElementById('max-api-call').innerText = max_count
	document.getElementById('remaining-call').innerText = `${parseFloat(count / max_count * 100).toFixed(2)}%`
}

getUserApiCount()

//logout function
// document.getElementById("logout").addEventListener("click", async () => {
// 	// document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
// 	// window.location.href = "/";
// 	fetch(`${host}/api/v1/signout`, {
// 		method: 'GET',
// 		headers: {
// 		  'Content-Type': 'application/json',
// 		},
// 	  }).then(response => {
// 		// Check if the response status indicates a successful redirect (e.g., 3xx status code)
// 		if (response.redirected) {
// 			console.log("redirecting");
// 			window.location.href = "/";
// 		  // The browser will automatically follow the redirect, so no further action needed
// 		} else {
// 		  // Handle the response as needed (this block will be executed if there is no redirect)
// 		  return response.json();
// 		}
// 	  })
	
// });
