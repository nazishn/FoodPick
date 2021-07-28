const { Router } = require('express');
const router = Router();
const { findAllProducts, addfood, addday, find_day, find_type, listofvotes,place_order, findAllOrder}  = require('../controllers/admin.controller');
router.get('/', findAllProducts);
router.post('/addfood', addfood);
router.patch('/addday', addday);
router.post('/findday', find_day)
router.post('/findtype', find_type)
router.get('/listofvotes', listofvotes)
router.get('/orderhistory', findAllOrder)
router.post('/placeorder', place_order)
module.exports = router;