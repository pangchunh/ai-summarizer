// const host = 'https://isa-ai-summarizer.onrender.com'
const host = 'http://localhost:3001'


async function fetchApiStat() {
  try {
    const res = await fetch(`${host}/api/v1/apistat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })

    const { data } = await res.json()

    const tableBody = document.getElementById('apiStatTableBody')
    data.forEach(stat => {
      const tableRow = displayApiStat(stat)
      tableBody.appendChild(tableRow)
    }
    )
  } catch (err) {
    console.log(err)

  }
}

function displayApiStat(data) {
  const { route, method, count, last_access } = data
  const tableRow = document.createElement('tr')
  tableRow.innerHTML = `
  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">${route}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${method}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${count}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${last_access}</td>
  `
  return tableRow
}

async function fetchUserStat() {
  try {
    const res = await fetch(`${host}/api/v1/userstat`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
    const { users } = await res.json()
    const tableBody = document.getElementById('userStatTableBody')
    users.sort((a, b) => { return a.uid - b.uid })
    users.forEach(user => {
      const tableRow = displayUserStat(user)
      tableBody.appendChild(tableRow)
    })
  } catch (err) {
    console.log(err)
  }
}




function displayUserStat(data) {
  const { username, email, count, max_count, uid } = data
  const tableRow = document.createElement('tr')
  tableRow.innerHTML = `
  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">${username}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${email}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${count}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${max_count}</td>
  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
  <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">${username}</span></a>
  </td>

  `
  //attache onclick event to the edit button
  const editButton = tableRow.querySelector('a')
  editButton.addEventListener('click', (e) => {
    e.preventDefault()
    displayuserEditForm(username, email, max_count, uid)
  }
  )

  return tableRow
}

function displayuserEditForm(username, email, max_count, uid) {
  const editForm = document.getElementById('editForm')
  editForm.style.display = 'block'
  const editUsername = document.getElementById('editUsername')
  const editEmail = document.getElementById('editEmail')
  const editMaxCount = document.getElementById('editMaxCount')
  editUsername.value = username
  editEmail.value = email
  editMaxCount.value = max_count
  const editSubmit = document.getElementById('editSubmit')
  editSubmit.addEventListener('click', async (e) => {
    e.preventDefault()
    await editUser(uid, username, email, max_count)
  })
  const deleteSubmit = document.getElementById('deleteSubmit')
  deleteSubmit.addEventListener('click', async (e) => {
    e.preventDefault()
    await deleteUser(uid)
  })
  //when user click on the cancel button, close the edit form
  const cancelButton = document.getElementById('editCancel')
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault()
    editForm.style.display = 'none'
  })
}

async function editUser(uid, oldUsername, oldEmail, oldMaxCount) {
  const username = document.getElementById('editUsername').value
  const email = document.getElementById('editEmail').value
  const max_count = document.getElementById('editMaxCount').value

  const body = { uid }
  if (username && username !== oldUsername) body.username = username
  if (email && email !== oldEmail) body.email = email
  if (max_count && max_count !== oldMaxCount) body.max_count = max_count
  if (!username && !email && !max_count) {
    alert('Please enter at least one field')
    return
  }
  const result = await fetch(`${host}/api/v1/update-user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  })
  const { message } = await result.json()
  if (message === 'User updated') {
    //display a message to user
    alert('User updated')
    window.location.reload()
  }
}

async function deleteUser(uid) {
  const result = await fetch(`${host}/api/v1/delete-user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',

    },
    credentials: 'include',
    body: JSON.stringify({ uid }),


  })
  const { message } = await result.json()
  if (message === 'User deleted') {
    //display a message to user
    alert('User deleted')
    window.location.reload()

  }
}


fetchApiStat()
fetchUserStat()
