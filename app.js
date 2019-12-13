const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema  = require('./schema/main')
const mongoose = require('mongoose')

const PORT  = process.env.PORT || 3000
const app = express()

mongoose.connect('mongodb://localhost:27017/grapql',{ useNewUrlParser : true, useUnifiedTopology : true })

app.use('/grapqhl',graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(PORT,() => console.log(`Server running on port  ${PORT}`))