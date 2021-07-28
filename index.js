const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const product = require('./models/product');
const vote = require('./models/vote')
const adminRouter = require('./routes/admin.routes');
const foodieRouter = require('./routes/foodie.routes');
const user_router= require('./routes/user.router');
const User = require('./models/user.model');
const config= require('./config/config')
const {newToken, verifyToken, signin, signup, protect_admin, protect_foodie} = require('./controllers/user.controllers')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(config.connection_string,{useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected')
  // we're connected!
});

//creating admin if not already in the database and adding days to the vote database
const find_admin = User.find({"type":"foodie"});

if (!find_admin){
admin = {"email": "admin123", "password":"admin123", "type": "admin"};
let user = new User(admin);
let savedObject = user.save();
const token = newToken(user);
console.log(User.find({"type":"admin"}))

let v1 = new vote({"day": "Monday"});
let savedObject1 = v.save();
let v2 = new vote({"day": "Tueday"});
let savedObject2 = v.save();
let v3 = new vote({"day": "Wednesday"});
let savedObject3 = v.save();
let v4 = new vote({"day": "Thursday"});
let savedObject4 = v.save();
let v5 = new vote({"day": "Friday"});
let savedObject5 = v.save();
let v6 = new vote({"day": "Saturday"});
let savedObject6 = v.save();
let v7 = new vote({"day": "Sunday"});
let savedObject7 = v.save();
}

//auth
app.use('',user_router)
//admin routes
app.use('/admin', protect_admin);
app.use('/admin', adminRouter);
//foodie routes
app.use('/foodie', protect_foodie);
app.use('/foodie', foodieRouter);

app.listen(3000, () => {
  console.log('running successfully on port 3000');
})