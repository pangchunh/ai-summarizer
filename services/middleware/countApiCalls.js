require('dotenv').config()
const {db} = require('../db/db')
const jwt = require('jsonwebtoken')

const countApiCalls = async (req, res, next) => {
  const { route, method } = req
  try {
    const { path } = route
    //get the current count for the api route
    const res = await db.oneOrNone(`select count from apistat where route = $1 and method = $2`, [path, method])
    if (!res){
      const result = await db.one('INSERT INTO apistat (route, method, count) VALUES ($1, $2, 1) RETURNING count', [path, method]);
      return next()
    } else{
      const { count } = res
      //update the count for the api route
      await db.none('UPDATE apistat SET count = $1, last_access = NOW() WHERE route = $2 AND method = $3', [count + 1, path, method]);
      next()
    }
  } catch (error) {
    console.log(error)
    res.status = 500
    res.json({ "message": "Error updating api count" })
  }
}

const countMlApiCall = async (req, res, next) => {
  const {token} = req.cookies
  const {uid} = jwt.verify(token, process.env.JWT_SECRET)
  try{
    const { role } = await db.one('SELECT role FROM "user" WHERE uid = $1', [uid]);
    if (role === 'admin') return next()
    const { count, max_count } = await db.one('SELECT count, max_count FROM userstat WHERE uid = $1', [uid]);
    if (count >= max_count){
      res.status = 401
      return res.json({ "message": "Max API calls reached, please contact admin to increase limit"})
    }
    await db.none('UPDATE userstat SET count = $1 WHERE uid = $2', [count + 1, uid]);
    next()
  } catch(err){
    console.log(err)
    res.status = 500
    res.json({ "message": "Error updating user count" })
  }
}

module.exports = {countApiCalls, countMlApiCall}