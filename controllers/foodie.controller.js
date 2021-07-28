const foodlist = require('../models/product');
const votes = require('../models/vote');
const User = require('../user/user.model');
const _ = require('underscore')
const {verifyToken}= require('../user/user.controllers')

//foodie controller

//food list of a day

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

//vote

const vote_foodie = async (req, res) => {
	const {name, day} = req.body;
	// check if user has voted for that day
	const v = await votes.find({"day": day});
	const vote_day = v[0];
	//console.log(vote_day)
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
    	// check if that food item is available for that day and vote if not done already 
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


const findAll = async (req, res) => {
    const food = await votes.find();
    res.json(food);
}

module.exports = {
    findlist,
    vote_foodie, findAll
}