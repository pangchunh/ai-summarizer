require('dotenv').config()
const express = require("express");
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('pg-promise')()(process.env.DATABASE_URL);
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');
const cookieParser = require('cookie-parser')
const { authenticatePage, authenicateAdmin } = require('../middleware/authenticate')


app.use(express.json(), cors(), cookieParser())
app.use(express.static(path.join(__dirname, '../../frontend/public')))

//create route to display main page using middleware
app.get("/mainpage", authenticatePage, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/html/main.html"))
})

//create route to display login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/login.html"))
})

//create route to display admin page using authenticateAdmin middleware
app.get("/admin", authenicateAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/html/admin.html"))
})

app.post("/api/v1/login", async (req, res) => {
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
    res.json({ "message": "User logged in", user, token })

  } catch (error) {
    res.send(error)

  }
})

app.post("/api/v1/create-user", async (req, res) => {
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
    const token = jwt.sign({ uid: newUser.uid }, process.env.JWT_SECRET)
    res.status = 201
    res.json({ "message": "User created", newUser, token })
  } catch (error) {
    res.send(error)
  }

})

//create route to signout
app.get("/api/v1/signout", (req, res) => {
  res.clearCookie('token')
  res.redirect('/')
})


app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`)
})
