const { Router } = require('express');
const router = Router();
const {findlist, vote_foodie, findAll}  = require('../controllers/foodie.controller');


router.get('/findlist', findlist);
router.post('/vote', vote_foodie);
router.get('/', findAll)
module.exports = router;
