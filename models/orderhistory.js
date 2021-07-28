const { Schema, model } = require('mongoose');


const orderSchema = new Schema({
    day: String,
    order_item: String

});
module.exports = model('orderhistory', orderSchema);