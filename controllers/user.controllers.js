// Start of file
const User = require('../models/user.model') 
const jwt = require('jsonwebtoken')
const config= require('../config/config')


const validateEmail= email=> {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


/**
 * Returns a token for a given user
 *
 * @param {object} user The user for which the token is to be generated where user={ email: x [String], password: y [String]}.
 * @return {String} jwt signed Token.
 */
const newToken = user => {
  return jwt.sign({id:user.id}, config.secret)
}

/**
 * Returns a token for a given user
 *
 * @param {String} token The token which is verified if it is valid or not
 * @return returns a reject if there is an error in veifying the token and resolves otherwise
 */
const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

/**
 * Signs into the application and sends the token in the response if successfully logged in.
 *
 * @param req.body={ email: x[String], password: y[String] } Signs in for the user with email x and password y.
 * gives token in response if correct email and password is used ("Sign in complete *token*") and gives error message in case of wrong email or password or both. 
 **/
const signin = async (req, res) => {
  if (!req.body.email || !req.body.password)
  {
    return res.send('No email or password')
  }
  const user = await User.findOne({email: req.body.email}).select('password').exec()
  if (!user)
  {
    return res.send('No email exist')
  }
  else
  {
    try
    {const valid = await user.checkPassword(req.body.password) 
      if (!valid)
      {
        return res.send('Invalid password')
      }
      else
      {
        const token= newToken(user)
        return res.send('Signin complete'+ token)
      }
    }
    catch(e){
      console.log(e)
      return
    }
  } 
}

/**
 * Signs up new user as a foodie.
 *
 * @param req.body={ email: x[String], password: y[String] } Signs up the user with email x and password y.
 * gives a response "Sign up complete" upon successful signup and gives error message otherwise. 
 **/
const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }
  if(!validateEmail(req.body.email))
  {
   return res.status(400).send({ message: 'Invalid email' }) 
  }
  try {
    foodie=req.body;
    foodie.type="foodie";
    const user = new User(foodie);
    const savedObject = await user.save();
    const token = newToken(user)
    return res.status(201).send('Sign up complete')
  } catch (e) {
    console.log(e)
    return res.status(500).send('problem')
  }
}

/**
 * protects the foodie route by checking if the given token is valid and corresponds to the foodie
 *
 * @param req.header.authorizatio= b [String] takes in a string of token in the format "Bearer *token*".
 * only allows to perform any further functions if the token is of a valid user of type "foodie" else return a 401 status and ends the response with a message.
 **/
const protect_foodie = async (req, res, next) => {
  const bearer = req.headers.authorization
  if (!bearer || !bearer.startsWith('Bearer ')) {
    console.log('no Bearer')
    return res.status(401).send('Does not start with Bearer')
  }
  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).send('problem')
  }
  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()
    console.log('payload' + payload);
    console.log(user)
  if (!user) {
    return res.status(401).send('no such user')
  }
  if (user.type!=="foodie") {
    return res.status(401).send('Not foodie')
  }
  req.user = user
  next()
}

/**
 * protects the admin route by checking if the given token is valid and corresponds to the admin
 *
 * @param req.header.authorizatio= b [String] takes in a string of token in the format "Bearer *token*".
 * only allows to perform any further functions if the token is of a valid user of type "admin" else return a 401 status and ends the response with a message.
 **/
const protect_admin = async (req, res, next) => {
  const bearer = req.headers.authorization
  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).send('Does not start with Bearer')
  }
  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).send('problem')
  }
  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()
  if (!user) {
    return res.status(401).send('no such user')
  }
  if (user.type!=="admin") {
    return res.status(401).send('Not Admin')
  }
  req.user = user
  next()
}
/**
 * Lists all present users in the database
**/
 const findAll = async (req, res) => {
    const users = await User.find();
    res.json(users);
}

module.exports = {findAll, newToken, verifyToken, signin, signup, protect_admin, protect_foodie}
