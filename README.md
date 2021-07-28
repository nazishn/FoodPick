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
#### Signup
To signup, navigate to ```localhost:3000/signup``` and enter the email and password in the body of the request.
#### Signin
To signin, navigate to `localhost:3000/signin` and enter the email and password in the body of the request.
