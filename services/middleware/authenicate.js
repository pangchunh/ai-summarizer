require('dotenv').config()
const {db} = require('../db/db')
const jwt = require('jsonwebtoken')


const authenicateAdmin = async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return res.redirect('/')
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { uid } = decoded
    const user = await db.oneOrNone(`select * from "user" where uid = '${uid}'`)
    if (!user) {
      return res.redirect('/')
    }
    if (user.role !== 'admin') {
      return res.redirect('/mainpage')
    }
    next()
  } catch (error) {
    console.log(error)
    return res.redirect('/')
  }
}

const authenicatePage = async (req, res, next) => {
  const { token } = req.cookies
  //if no token, redirect to login page
  if (!token) {
    return res.redirect('/')
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { uid } = decoded
    const user = await db.oneOrNone(`select * from "user" where uid = '${uid}'`)
    if (!user) {
      return res.redirect('/')
    }
    next()
  } catch (error) {
    return res.redirect('/')
  }
}

const authenicateAPI = async (req, res, next) => {
  const authHeader = req.headers.authorization
  //check if cookie token exists

  if (!authHeader && !req.cookies.token) {
    res.status = 401
    return res.json({ "message": "No token provided" })
  }
  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { uid } = decoded
    const user = await db.oneOrNone(`select * from "user" where uid = '${uid}'`)
    if (!user) {
      res.status = 401
      return res.json({ "message": "User not find, please retry" })
    }
    req.user = user
    next()
  } catch (error) {
    res.status = 401
    return res.json({ "message": `Invalid token: ${error}` })
  }
}

module.exports = {authenicateAdmin, authenicatePage, authenicateAPI }; 
