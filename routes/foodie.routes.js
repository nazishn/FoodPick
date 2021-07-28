const { Router } = require('express');
const router = Router();
const {findlist, vote_foodie}  = require('../controllers/foodie.controller');


router.get('/findlist', findlist);
router.post('/vote', vote_foodie);
module.exports = router;
