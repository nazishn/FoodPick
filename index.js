const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const product = require('./models/product');
const vote = require('./models/vote')

const adminRouter = require('./routes/admin.routes');
const foodieRouter = require('./routes/foodie.routes');

const user_router= require('./user/user.router');
const User = require('./user/user.model');
const connection= require('./config/config')
const {newToken, verifyToken, signin, signup, protect_admin, protect_foodie} = require('./user/user.controllers')



const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(connection,{useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected')
  // we're connected!
});



//creating admin if not already in the database

const find_admin = User.find({"type":"foodie"});

if (!find_admin){
admin = {"email": "admin123", "password":"admin123", "type": "admin"};
var user = new User(admin);
var savedObject = user.save();
const token = newToken(user);
console.log(User.find({"type":"admin"}))


var v = new vote({"day": "Monday"});
var savedObject = v.save();
var v = new vote({"day": "Tueday"});
var savedObject = v.save();
var v = new vote({"day": "Wednesday"});
var savedObject = v.save();
var v = new vote({"day": "Thursday"});
var savedObject = v.save();
var v = new vote({"day": "Friday"});
var savedObject = v.save();
var v = new vote({"day": "Saturday"});
var savedObject = v.save();
var v = new vote({"day": "Sunday"});
var savedObject = v.save();
}
// admin token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjlhMDViNmY2Zjg1MDEwMWUxNTgwOCIsImlhdCI6MTYyNjk3MjQwOH0.-z13BgOjsz9U0w5kuphkNl0aMqg0uX3aS1-SXnGfU60





//signin/ signup
app.use('',user_router)

app.use('/admin', protect_admin);
app.use('/admin', adminRouter);

//admin routes

app.use('/foodie', protect_foodie);
app.use('/foodie', foodieRouter);


//foodie routes

app.listen(3000, () => {
  console.log('running successfully on port 3000');
})