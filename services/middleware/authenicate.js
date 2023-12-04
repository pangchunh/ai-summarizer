require('dotenv').config()
const {db} = require('../db/db')
const jwt = require('jsonwebtoken')


const authenicateAdmin = async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).redirect('/')
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { uid } = decoded
    const user = await db.oneOrNone(`select * from "user" where uid = $1`, [uid])
    if (!user) {
      return res.status(401).redirect('/')
    }
    if (user.role !== 'admin') {
      return res.status(401).redirect('/mainpage')
    }
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).redirect('/')
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
    const user = await db.oneOrNone(`select * from "user" where uid = $1`, [uid])
    if (!user) {
      return res.status(401).redirect('/')
    }
    next()
  } catch (error) {
    return res.status(500).redirect('/')
  }
}

const authenicateAPI = async (req, res, next) => {
  const authHeader = req.headers.authorization
  //check if cookie token exists

  if (!authHeader && !req.cookies.token) {
    return res.status(401).json({ "message": "No token provided" })
  }
  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { uid } = decoded
    const user = await db.oneOrNone(`select * from "user" where uid = $1`, [uid])
    if (!user) {
      return res.status(401).json({ "message": "User not find, please retry" })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ "message": `Invalid token: ${error}` })
  }
}

module.exports = {authenicateAdmin, authenicatePage, authenicateAPI }; 
