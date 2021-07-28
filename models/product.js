const { Schema, model } = require('mongoose');


const foodlistSchema = new Schema({
    name: String,
	type: String,
	price: Number,
	rating: Number,
	days: Array

});
module.exports = model('FoodList', foodlistSchema);