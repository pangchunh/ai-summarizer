// strings.js

const strings = {
  pageTitle: "Login and Registration",
  imageSource: "https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75",
  notFoundText: "404",
  notFoundTitle: "Page not found",
  notFoundDescription: "Sorry, we couldn’t find the page you’re looking for.",
  backToHomeText: "Back to home",
  homeLink: "https://isa-ai-summarizer.onrender.com/"
};

document.getElementById('pageTitle').innerText = strings.pageTitle;
document.getElementById('image').src = strings.imageSource;
document.getElementById('notFoundText').innerText = strings.notFoundText;
document.getElementById('notFoundTitle').innerText = strings.notFoundTitle;
document.getElementById('notFoundDescription').innerText = strings.notFoundDescription;
document.getElementById('backToHome').href = strings.homeLink;
document.getElementById('backToHome').innerText = `${strings.backToHomeText} `;
