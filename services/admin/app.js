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
const { authenicateAdmin } = require('../middleware/authenicate')
const { countApiCalls } = require('../middleware/countApiCalls')
const { allowCors } = require('../middleware/cors')

const allowedOrigins = ['http://localhost:3000',
  'http://localhost:3001',
  'https://isa-ai-summarizer-admin.onrender.com',
  'https://isa-ai-summarizer.onrender.com',
  'https://isa-ai-summarizer-admin.onrender.com/',
  'https://isa-ai-summarizer.onrender.com/'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 204,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS',]
}



app.use(express.json(), cors(corsOptions), cookieParser())
// app.use(allowCors)
app.use(express.static(path.join(__dirname, '../../frontend/public')))

//

app.get('/api/v1/apistat', countApiCalls, authenicateAdmin, async (req, res) => {
  //get all api routes stat from the apistat table
  const data = await db.any(`select * from apistat`)
  res.status = 200
  const message = "All API stats retrieved"
  res.json({ data, message })
})

app.get('/api/v1/userstat', countApiCalls, authenicateAdmin, async (req, res) => {
  //get all user routes stat from the userstat table
  try{
    const data = await db.any(`select * from userstat`)
    const users = await Promise.all(data.map(async (user) => {
      const { uid } = user
      const { username, email } = await db.one(`select username,email from "user" where uid = '${uid}'`)
      return { ...user, username, email }
    }))
    res.status = 200
    const message = "All user stats retrieved"
    res.json({ users, message })

  } catch(err){
    res.status = 500
    const message = `Error retrieving user stats ${err}`
    res.json({ message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
}
);

app.put("/api/v1/update-user", countApiCalls, authenicateAdmin, async (req, res) => {

  const { uid, max_count, username, email } = req.body
  try {

    if (max_count && parseInt(max_count)) {
      const new_max_count = parseInt(max_count)
      await db.none(`update userstat set max_count = ${new_max_count} where uid = '${uid}'`)
    }
    if (username) {
      await db.none(`update "user" set username = '${username}' where uid = '${uid}'`)
    }
    if (email) {
      await db.none(`update "user" set email = '${email}' where uid = '${uid}'`)
    }
    res.status = 200
    res.json({ "message": "User updated" })
  } catch (error) {
    console.log(error)
    res.status = 500
    res.json({ "message": `Error updating user ${error}` })
  }
}
)

app.delete("/api/v1/delete-user", countApiCalls, authenicateAdmin, async (req, res) => {
  const { uid } = req.body
  try {
    await db.none(`delete from "user" where uid = '${uid}'`)
    res.status = 200
    res.json({ "message": "User deleted" })
  } catch (error) {
    res.status = 500
    res.json({ "message": `Error deleting user ${error}` })
  }
}
)

// async function setDefaultApiCount(){
//   //go to the 'user' table and grab all the user id, create a new row in the apistat table for each user id and set the count to 0
//   const users = await db.any(`select uid from "user"`)
//   users.forEach(async (user) => {
//     if (user.role === 'admin') return
//     const { uid } = user
//     await db.none(`insert into userstat (uid, count) values ('${uid}', 0)`)
//   })
// }

// setDefaultApiCount()

