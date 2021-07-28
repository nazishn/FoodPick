const { Router } = require('express')
const {findAll, newToken, verifyToken, signin, signup} = require('../controllers/user.controllers')

const router = Router()

router.get('/',findAll)
router.post('/signin', signin)
router.post('/signup', signup)


module.exports = router;