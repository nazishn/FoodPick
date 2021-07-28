# FoodPick
An application that solves the "what's for dinner?" problem. The application has two users. Admins and retail-food-hungry-engineers (foodies). The admins can create a list of items, those items are recommended to the engineers on a daily basis. Engineers can vote on the item that they want to eat for that particular day, whatever item has the most number of votes get ordered for that day.
## Getting Started
Clone the repo and install the dependencies.
```
git clone https://github.com/nazishn/FoodPick.git
cd FoodPick
```
```
npm install
```
Add the connection string and secret string in ```/config/config.js```.

## Starting Server
To start server, run ```index.js``` in terminal
```
node index.js
```
The default port for the server is ```3000```.
```
localhost:3000/
```
## Routes
Routes for performing different tasks and functions is as follows
`POST localhost:3000/signup` to sign up.
`POST localhost:3000/signin` to sign in.
#### Admin Routes
`POST /admin/addfood` to add food items.
`PATCH /admin/addday` to assign days to existing food items.
`GET /admin/` to fetch food list.
`POST /admin/findday` to fetch food list based on a particular day.
`POST /admin/findtype` to fetch food list based in the type of the food.
`GET /admin/listofvote` to list the votes for all food items for a particular day.
``GET /admin/placeorder`` to place order.
``GET /admin/orderhistory`` to list the order history.
#### User/Foodie Routes
``GET /foodie/findlist`` to list food items based on the day.
``POST /foodie/vote`` to cast vote for a particular day.

## Technologies Used
- Node JS
- Express
- MongooDB

## Author
Nazish Naeem

