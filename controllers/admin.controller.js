// Start of file
const foodlist = require('../models/product');
const vote = require('../models/vote')
const orderhistory = require('../models/orderhistory')
const _ = require('underscore')

/**
 * Adds a new food item to the database and prints it in the response
 *
 * @param req.body={ name: x[String], type: y[String], price: p[number], rating: r[number] } The details of a new food item that is to be added in the database.
 * @response Prints the new saved object in reponse.
 **/
const addfood = async (req, res) => {
    const { name, type, price, rating } = req.body;
    const newProduct = new foodlist({name, type, price, rating});
    const savedObject = await newProduct.save();
    res.json(savedObject);
}

/**
 * Assigns days to the existing food item by updating in the database.
 *
 * @param req.body={ name: x[String], days: D[Array]} The days D to be assigned to food item x.
 * @response The updates product
 **/
const addday = async (req, res) => {
    const { name, days } = req.body;
    const item = await foodlist.find({"name": name});
    console.log(item)
    const { _id } = item[0];
    console.log(_id)
    const updateProduct = await foodlist.updateOne({_id}, {days});
    res.json(updateProduct);
}

/**
 * Lists all food items in the database
**/
const findAllProducts = async (req, res) => {
    //const remove = await foodlist.deleteOne({"_id": "60fe759ae98c3000142e8fff"})
    const food = await foodlist.find();
    res.json(food);
}

/**
 * Sends a list of food items which are available for a particular day as response.
 *
 * @param req.body={ day: y [string] } The day y for which the list of food items is fetched.
 **/
const find_day = async (req, res) => {
    const {day}=req.body;
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
 * Sends a list of food items which are of a particular type as response.
 *
 * @param req.body={ type: t [string] } The type t of which the list of food items is fetched.
 **/
const find_type = async (req, res) => {
    const {type}=req.body;
    const food = await foodlist.find();
    const food_type= _.filter(food,(item) => 
    {
        if (item.type === type)
            {return item.name}
    })
    res.send(food_type);
}

/**
 * Sends a list of food items and number of votes for each of them for a particular day.
 *
 * @param req.body={ day: y [string] } The day y for which the list of food items and their number of votes are needed.
 * @response lists the number of votes for all the food items for a particular day.
 **/
const listofvotes = async (req,res) => {
    const {day} = req.query;
    const v = await vote.find({"day" : day});
    const vote_day=v[0];
    const food = await foodlist.find();
    const food_name= _.map(food,(item) => 
    {
        return item.name;
    }
    )
    let vote_count ={};
    let max=0;
    let order_item;

    _.each(food_name, (item) => 
    {
        var num= _.filter(vote_day.vote,x => x==item).length;
        vote_count[item]=num;
        if (num>=max)
        {order_item=item;
            max=num}

    })
    const {_id} =vote_day;
    const updateProduct = await vote.updateOne({_id}, {order_item});
    res.send(vote_count)
}

/**
 * Places the order for the most voted food item for a particular day and saves in the order history
 *
 * @param req.body={ day: y [string] } The day y for which order is to be placed.
 * @response the order item details.
 **/
const place_order= async (req, res) =>{
    const {day} = req.body;
    const v = await vote.find({"day" : day});
    const vote_day=v[0];
    const order_item=vote_day.order_item;
    const newProduct = new orderhistory({day, order_item});
    const savedObject = await newProduct.save();
    res.json(savedObject);
}

/**
* Sends the complete order history in the response
**/
const findAllOrder = async (req, res) => {
    const OH = await orderhistory.find();
    res.json(OH);
}

module.exports = {
    findAllProducts,
    addfood,
    addday,
    find_day,
    find_type,
    listofvotes,
    place_order,
    findAllOrder
}