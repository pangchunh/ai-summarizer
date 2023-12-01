const host = 'http://localhost:3000'


async function fetchApiStat() {
  const res = await fetch(`${host}/api/v1/apistat`)
  const { data } = await res.json()
  const tableBody = document.getElementById('apiStatTableBody')
  data.forEach(stat => {
    const tableRow = displayApiStat(stat)
    tableBody.appendChild(tableRow)
  }
  )
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
  const res = await fetch(`${host}/api/v1/userstat`)
  const { users } = await res.json()
  const tableBody = document.getElementById('userStatTableBody')
  users.forEach(user => {
    const tableRow = displayUserStat(user)
    tableBody.appendChild(tableRow)
  })
}

function displayUserStat(data) {
  const { username, email, count, max_count } = data
  const tableRow = document.createElement('tr')
  tableRow.innerHTML = `
  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">${username}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${email}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${count}</td>
  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${max_count}</td>

  `
  return tableRow
}

fetchApiStat()
fetchUserStat()