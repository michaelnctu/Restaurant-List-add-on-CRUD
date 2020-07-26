// require packages
const mongoose = require('mongoose')
const Restaurant = require('../restaurant')

const restaurantList = require('../../restaurant.json')

// setting mongoose connection
mongoose.connect('mongodb://localhost/Restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// get mongo db connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')

  restaurantList.results.forEach(element => {
    Restaurant.create(element)
  });

  console.log('done')
})