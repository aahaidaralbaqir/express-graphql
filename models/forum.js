const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const ForumSChema = new Schema({
    title : String,
    desc : String,
    userId : String
})

module.exports = mongoose.model('Forum',ForumSChema)