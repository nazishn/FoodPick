const { Schema, model } = require('mongoose');


const voteSchema = new Schema({
    day: String,
    user: Array,
    vote: Array,
    order_item: String

});
module.exports = model('vote', voteSchema);