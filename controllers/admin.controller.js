// Start of file
const foodlist = require('../models/product');
const vote = require('../models/vote')
const orderhistory = require('../models/orderhistory')



const _ = require('underscore')

// admin controllers

// add food items
const addfood = async (req, res) => {
    const { name, type, price, rating } = req.body;
    const newProduct = new foodlist({name, type, price, rating});
    const savedObject = await newProduct.save();
    res.json(savedObject);
}


// assign days to food items

const addday = async (req, res) => {
    const { name, days } = req.body;
    const item = await foodlist.find({"name": name});
    console.log(item)
    const { _id } = item[0];
    console.log(_id)
    const updateProduct = await foodlist.updateOne({_id}, {days});
    res.json(updateProduct);
}


// fetch all the food items
const findAllProducts = async (req, res) => {
    //const remove = await foodlist.deleteOne({"_id": "60fe759ae98c3000142e8fff"})
    const food = await foodlist.find();
    res.json(food);
}


// fetch food items based on days
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

// fetch food items based on type
const find_type = async (req, res) => {
    const {type}=req.body;
    const food = await foodlist.find();
    const food_type= _.filter(food,(item) => 
    {
        if (item.type === type)
            {return item.name}
    }
    )
    res.send(food_type);
}

//food items and votes
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
    var vote_count ={};
    var max=0;
    var order_item;

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




//place order

const place_order= async (req, res) =>{
    const {day} = req.body;
    const v = await vote.find({"day" : day});
    const vote_day=v[0];
    const order_item=vote_day.order_item;
    const newProduct = new orderhistory({day, order_item});
    const savedObject = await newProduct.save();
    res.json(savedObject);


}



//history of orders
const findAllOrder = async (req, res) => {
    const OH = await orderhistory.find();
    res.json(OH);
}


//



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