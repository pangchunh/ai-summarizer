require('dotenv').config()
const db = require('pg-promise')()(process.env.DATABASE_URL);
const jwt = require('jsonwebtoken')

const countApiCalls = async (req, res, next) => {
  const { route, method } = req
  try {
    const { path } = route
    //get the current count for the api route
    const res = await db.oneOrNone(`select count from apistat where route = '${path}' and method = '${method}'`)
    if (!res){
      await db.one(`insert into apistat (route, method, count) values ('${path}', '${method}', 1) RETURNING count`)
      return next()
    } else{
      const { count } = res
      //update the count for the api route
      await db.none(`update apistat set count = ${count + 1}, last_access = now() where route = '${path}' and method = '${method}'`)
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
    const {role} = await db.one(`select role from "user" where uid = '${uid}'`)
    if (role === 'admin') return next()
    const {count, max_count} = await db.one(`select count, max_count from userstat where uid = '${uid}'`)
    if (count >= max_count){
      res.status = 401
      return res.json({ "message": "Max API calls reached, please contact admin to increase limit"})
    }
    await db.none(`update userstat set count = ${count + 1} where uid = '${uid}'`)
    next()
  } catch(err){
    console.log(err)
    res.status = 500
    res.json({ "message": "Error updating user count" })
  }
}

module.exports = {countApiCalls, countMlApiCall}