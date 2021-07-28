const User = require('./user.model') 
const jwt = require('jsonwebtoken')




const newToken = user => {
  return jwt.sign({id:user.id}, 'learneverything')
}

const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, 'learneverything', (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })










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

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }

  try {
    //const user = await User.create(req.body)

    foodie=req.body;
    foodie.type="foodie";
    const user = new User(foodie);
    const savedObject = await user.save();
    

    const token = newToken(user)

    return res.status(201).send({ token })
  } catch (e) {

    console.log(e)
    return res.status(500).send('problem')
  }
}




const protect_foodie = async (req, res, next) => {
  const bearer = req.headers.authorization


  console.log('..')
  console.log('In protect ' + bearer)
  console.log('..')

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
    console.log('no such user')
    return res.status(401).send('no such user')
  }
  if (user.type!=="foodie") {
    console.log('Not foodie')
    return res.status(401).send('Not foodie')
  }

  req.user = user
  next()
}


const protect_admin = async (req, res, next) => {
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
    console.log('no such user')
    return res.status(401).send('no such user')
  }
  if (user.type!=="admin") {
    console.log('Not Admin')
    return res.status(401).send('Not Admin')
  }

  req.user = user
  next()
}


 const findAll = async (req, res) => {
    const users = await User.find();
    res.json(users);
}




module.exports = {findAll, newToken, verifyToken, signin, signup, protect_admin, protect_foodie}
