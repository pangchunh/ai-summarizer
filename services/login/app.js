require('dotenv').config()
const express = require("express");
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3001;
const db = require('pg-promise')()(process.env.DATABASE_URL);
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');
const cookieParser = require('cookie-parser')
const { authenicatePage, authenicateAdmin } = require('../middleware/authenicate')
const { countApiCalls, countMlApiCall } = require('../middleware/countApiCalls')
// const mlhost = process.env.ML_HOST || 'https://547b-99-199-61-101.ngrok-free.app/'
const mlhost = 'http://127.0.0.1:5000'

app.use(express.json(), cors(), cookieParser())
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

app.post("/api/v1/login", countApiCalls, async (req, res) => {
  const { username, password } = req.body

  try {
    //retrieve user base on username
    const user = await db.oneOrNone(`select * from "user" where username like '${username}'`)
    if (!user) {
      res.status = 401
      return res.json({ "message": "User not find, please retry" })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      res.status = 401
      return res.json({ "message": "Password incorrect, please retry" })
    }
    //create token with user id and send back to user
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET)

    res.status = 200
    res.cookie('token', token, { httpOnly: true })
    res.json({ "message": "Login successful", user })

  } catch (error) {
    res.send(error)

  }
})

app.post("/api/v1/create-user", countApiCalls, async (req, res) => {
  //create a user in the database by hasing the password in the body
  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const user = await db.oneOrNone(`select * from "user" where username like '${username}'`)
    if (user) {
      res.status = 401
      return res.json({ "message": "User already exists, please retry" })
    }
    const newUser = await db.one(`insert into "user" (username, email, password) values ('${username}', '${email}', '${hashedPassword}') returning *`)
    await db.none(`insert into userstat (uid, count) values ('${newUser.uid}', 0)`)
    const token = jwt.sign({ uid: newUser.uid }, process.env.JWT_SECRET)
    res.status = 201
    res.cookie('token', token, { httpOnly: true })
    res.json({ "message": "User created", newUser })
  } catch (error) {
    res.send(error)
  }

})

app.post("/api/v1/summarize", countApiCalls, authenicatePage, async (req, res) => {
  const { paragraph } = req.body
  const { token } = req.cookies
  const { uid } = jwt.verify(token, process.env.JWT_SECRET)

  try{
    const {role} = await db.one(`select role from "user" where uid = '${uid}'`)
    if (role !== 'admin'){
      const { count, max_count } = await db.one(`select count, max_count from userstat where uid = '${uid}'`)
      if (count >= max_count) {
        res.status = 401
        return res.json({ "message": "Max API calls reached, please contact admin to increase limit" })
      }
      await db.none(`update userstat set count = ${count + 1} where uid = '${uid}'`)
    }
    const result = await fetch(`${mlhost}/api/v1/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paragraph })
    })
    const data = await result.json()
    console.log(`data from ml server: ${JSON.stringify(data)}`)
    res.status = 200
    res.json({ data, "message": "Successfully Summarized text" })
  }catch(err){
    res.status = 500
    res.json({ "message": "Error summarizing text" })
  }})

app.get("/api/v1/get-user-api-count", countApiCalls, authenicatePage, async (req, res) => {
  const { token } = req.cookies
  const { uid } = jwt.verify(token, process.env.JWT_SECRET)
  try{
    const data = await db.one(`select count, max_count from userstat where uid = '${uid}'`)
    res.status = 200
    res.json({ data, "message": "Successfully retrieved user count" })
  } catch(err){
    res.status = 500
    res.json({ "message": `Error retrieving user count ${err}` })
  }
})


//create route to signout
app.get("/api/v1/signout", countApiCalls, (req, res) => {
  res.clearCookie('token')
  res.redirect('/')
})

//404 handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../../frontend/public/html/404.html'))
})


app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`)
})
