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

// const corsOptions = {
//   origin: allowedOrigins,
//   credentials: true,
//   optionsSuccessStatus: 204,
//   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS',]
// }



app.use(express.json(), cookieParser())
app.use(allowCors)
app.use(express.static(path.join(__dirname, '../../frontend/public')))

//

//handle preflight request
// app.options('*', cors())




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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
}
);