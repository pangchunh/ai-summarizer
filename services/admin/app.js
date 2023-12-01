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

app.use(express.json(), cors(), cookieParser())
app.use(express.static(path.join(__dirname, '../../frontend/public')))

//

app.get('/api/v1/apistat', async (req, res) => {
  //get all api routes stat from the apistat table
  const data = await db.any(`select * from apistat`)
  res.status = 200
  const message = "All API stats retrieved"
  res.json({ data, message })
})

app.get('/api/v1/userstat', async (req, res) => {
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
    const message = "Error retrieving user stats"
    res.json({ message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
}
);

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

