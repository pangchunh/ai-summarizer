const host = 'https://isa-ai-summarizer.onrender.com'
// const host = 'http://localhost:3000'

let authToken = null; // Declare a global variable to store the token


//handle form submit
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault()
  login()
}
)

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault()
  register()
}
)

//populate register form when user click on the register link
document.getElementById('registerLink').addEventListener('click', (e) => {
  e.preventDefault()
  document.getElementById('loginForm').style.display = 'none'
  document.getElementById('registerForm').style.display = 'block'
})



async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log("clicked")

  const result = await fetch(`${host}/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password})
  })
  const data = await result.json()
  console.log(`data: ${data.message}, data.token: ${data.token}, data.user: ${data.user}`)
  //if success, redirect user and set cookie
  if (data.token){
    authToken = data.token;
    document.cookie = `token=${data.token}`
    //redirect to main.html by calling get request from server
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    window.location.href = `${host}/mainpage`

  } else{
    document.getElementById('error').innerText = data.message
  }
  
}

async function goToMainPage() {
  const cookies = document.cookie.split(';'); 
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

  
  if (!tokenCookie) {
    console.error('JWT token not found');
    return;
  }
  const token = tokenCookie.split('=')[1];
  console.log(`token: ${token}`)
  
  const result = await fetch(`${host}/mainpage`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
      'Authorization': `Bearer ${token}`
    }
  })
}




async function register() {
  const username = document.getElementById('registerUserName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Add user if not exists in DB
  const result = await fetch(`${host}/api/v1/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, email, password})
  })

  const data = await result.json()

  //if success, redirect user and set cookie
  if (data.token){
    document.cookie = `token=${data.token}`
    window.location.href = '/main.html'
  } else{
    document.getElementById('error').innerText = data.message
  }

}

async function logout() {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  window.location.href = '/login.html'
}