// const loginhost = 'https://isa-ai-summarizer.onrender.com'
const loginhost = 'http://localhost:3001'

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

  const result = await fetch(`${loginhost}/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  const data = await result.json()
  //if success, redirect user and set cookie
  if (data.message === 'Login successful') {
    window.location.href = `${loginhost}/admin`

  } else {
    document.getElementById('error').innerText = data.message
  }

}

async function register() {
  const username = document.getElementById('registerUserName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Add user if not exists in DB
  const result = await fetch(`${loginhost}/api/v1/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })

  const data = await result.json()
  //if success, redirect user and set cookie
  if (data.message === 'User created') {
    window.location.href = `${loginhost}/mainpage`
  } else {
    document.getElementById('error').innerText = data.message
  }

}

// async function logout() {
//   document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
//   window.location.href = `${loginhost}/`
// }