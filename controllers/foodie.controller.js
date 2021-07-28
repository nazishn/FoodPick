// Start of file
const foodlist = require('../models/product');
const votes = require('../models/vote');
const User = require('../models/user.model');
const _ = require('underscore')
const {verifyToken}= require('./user.controllers')

/**
 * Sends a list of food items which are available for a particular day as response.
 *
 * @param req.body={ day: y [string] } The day y for which the list of food items is fetched.
 **/

const findlist = async (req, res) => {
    const {day} = req.query;
    const food = await foodlist.find();
    const food_day= _.filter(food,(item) => 
    {
        if (item.days.find(e => e === day) === day)
            {return item.name}
    }
    )
    res.send(food_day);
}

/**
 * Sends a response "vote casted!", "already voted" and "no such food item available for given day" depending on if the vote is casted successfully, vote is already casted for that day by a particular user and there is no mentioned food item available for that day respectively.
 *
 * @param req.body={ name: x [string], day: y [string] } casts vote for x for day y.
 **/
const vote_foodie = async (req, res) => {
	const {name, day} = req.body;
	// check if user has voted for that day
	const v = await votes.find({"day": day});
	const vote_day = v[0];
	const bearer = req.headers.authorization
	const token = bearer.split('Bearer ')[1].trim()
	let payload
    payload = await verifyToken(token)
	const users= await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()
    
    if (vote_day.user.find(e => e === users.email) === users.email)
    {
    	return res.send('already voted')
    }
    else
    {
    	// check if that food item is available for the given day and vote if not done already 
    	try{
    	const food = await foodlist.find({"name": name});
        if (food[0].days.find(e => e === day) === day)
            {
            	const {_id, user, vote} =vote_day;
            	user.push(users.email);
            	vote.push(name);
    			const updateProduct = await votes.updateOne({_id}, {user, vote});
    			res.send('vote casted!')
            }
        else
        {
        	res.send('no such food item available for given day')
        }}
        catch (e) {

    		console.log(e)
    		return res.status(500).send('problem')
  		}
    }
}

module.exports = {
    findlist,
    vote_foodie
}