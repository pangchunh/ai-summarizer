require('dotenv').config()
const express = require("express");
const cors = require('cors')
const app = express();
const axios = require('axios')
const PORT = process.env.PORT || 3001;
const {db} = require('../db/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');
const cookieParser = require('cookie-parser')
const { authenicatePage, authenicateAdmin } = require('../middleware/authenicate')
const { countApiCalls } = require('../middleware/countApiCalls')
const { allowCors } = require('../middleware/cors');
// const mlhost = process.env.ML_HOST || 'https://547b-99-199-61-101.ngrok-free.app/'
const mlhost = 'https://bdaf-216-232-192-84.ngrok-free.app'


app.use(express.json(), cookieParser(), allowCors)
app.use(express.static(path.join(__dirname, '../../frontend/public')))

//create route to display main page using middleware
app.get("/mainpage", authenicatePage, countApiCalls, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/html/main.html"))
})

//create route to display login page
app.get("/", countApiCalls, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/html/login.html"))
})

//create route to display admin page using authenticateAdmin middleware
app.get("/admin", authenicateAdmin, countApiCalls, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/html/admin.html"))
})

app.get("/api/v1/docs", countApiCalls, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/html/docs.html"))
})

app.post("/api/v1/login", countApiCalls, async (req, res) => {
  const { username, password } = req.body

  try {
    //retrieve user base on username
    const user = await db.oneOrNone('SELECT * FROM "user" WHERE username = $1', [username]);
    if (!user) {
      return res.status(401).json({ "message": "User not find, please retry" })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ "message": "Password incorrect, please retry" })
    }
    //create token with user id and send back to user
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET)

    res.cookie('token', token, { httpOnly: true })
    res.status(200).json({ "message": "Login successful", user })

  } catch (error) {
    res.send(error)

  }
})

app.post("/api/v1/create-user", countApiCalls, async (req, res) => {
  //create a user in the database by hasing the password in the body
  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const user = await db.oneOrNone('SELECT * FROM "user" WHERE username = $1', [username]);
    if (user) {
      return res.status(401).json({ "message": "User already exists, please retry" })
    }
    const newUser = await db.one('INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
    await db.none('INSERT INTO userstat (uid, count) VALUES ($1, 0)', [newUser.uid]);
    const token = jwt.sign({ uid: newUser.uid }, process.env.JWT_SECRET)
    res.cookie('token', token, { httpOnly: true })
    res.status(201).json({ "message": "User created", newUser })
  } catch (error) {
    res.send(error)
  }
})

app.get("get-api-doc", countApiCalls, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/html/apidocs.html"))
})

app.post("/api/v1/summarize", countApiCalls, authenicatePage, async (req, res) => {
  const { paragraph } = req.body
  const { token } = req.cookies
  const { uid } = jwt.verify(token, process.env.JWT_SECRET)

  try {
    const { role } = await db.one('SELECT role FROM "user" WHERE uid = $1', [uid]);
    if (role !== 'admin') {
      const { count, max_count } = await db.one('SELECT count, max_count FROM userstat WHERE uid = $1', [uid]);
      if (count >= max_count) {
        return res.status(401).json({ "message": "Max API calls reached, please contact admin to increase limit" })
      }
      await db.none('UPDATE userstat SET count = $1 WHERE uid = $2', [count + 1, uid]);
    }

    const result = await axios.post(`${mlhost}/api/v1/summarize`, { paragraph }, 
      )

    const {data} = result
    res.status(200).json({ data, "message": "Successfully Summarized text" })
  } catch (err) {
    res.status(500).json({ "message": `Error summarizing text: ${err}` })
  }
})

app.get("/api/v1/get-user-api-count", countApiCalls, authenicatePage, async (req, res) => {
  const { token } = req.cookies
  const { uid } = jwt.verify(token, process.env.JWT_SECRET)
  try {
    const data = await db.one(`select count, max_count from userstat where uid = $1`, [uid])
    res.status(200).json({ data, "message": "Successfully retrieved user count" })
  } catch (err) {
    res.status(500).json({ "message": `Error retrieving user count ${err}` })
  }
})

//create route to signout
app.get("/api/v1/signout", countApiCalls, (req, res) => {
  res.clearCookie('token')
  res.status(302).redirect('/')
})

//admin routes starts here

app.get('/api/v1/apistat', countApiCalls, authenicateAdmin, async (req, res) => {
  //get all api routes stat from the apistat table
  const data = await db.any(`select * from apistat`)
  const message = "All API stats retrieved"
  res.status(200).json({ data, message })
})

app.get('/api/v1/userstat', countApiCalls, authenicateAdmin, async (req, res) => {
  //get all user routes stat from the userstat table
  try {
    const data = await db.any(`select * from userstat order by uid asc`)
    const users = await Promise.all(data.map(async (user) => {
      const { uid } = user
      const { username, email } = await db.one(`select username,email from "user" where uid = $1`, [uid])
      return { ...user, username, email }
    }))
    const message = "All user stats retrieved"
    res.status(200).json({ users, message })

  } catch (err) {
    const message = `Error retrieving user stats ${err}`
    res.status(500).json({ message })
  }
})

app.put("/api/v1/update-user", countApiCalls, authenicateAdmin, async (req, res) => {

  const { uid, max_count, username, email } = req.body
  try {

    if (max_count && parseInt(max_count)) {
      const new_max_count = parseInt(max_count)
      await db.none(`update userstat set max_count = ${new_max_count} where uid = $1`, [uid])
    }
    if (username) {
      await db.none(`update "user" set username = '${username}' where uid = $1`, [uid])
    }
    if (email) {
      await db.none(`update "user" set email = $1 where uid = $2`, [email, uid])
    }
    res.status(200).json({ "message": "User updated" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ "message": `Error updating user ${error}` })
  }
}
)

app.delete("/api/v1/delete-user", countApiCalls, authenicateAdmin, async (req, res) => {
  //use query string to get uid to delete
  const uid = req.query.uid

  try {
    await db.none('DELETE FROM "user" WHERE uid = $1', [uid])
    res.status(200).json({ "message": "User deleted" })
  } catch (error) {
    res.status(500).json({ "message": `Error deleting user ${error}` })
  }
}
)

//404 handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../../frontend/public/html/404.html'))
})


app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`)
})
