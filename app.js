const express = require('express')  //使用express
const app = express()
const exphbs = require('express-handlebars')  //handlebars
const port = 3000

const restList = require('./restaurant.json')


// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

// routes setting

app.get('/', (req, res) => {
  res.render('index', { restaurants: restList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)
  res.render('show', { restaurant: restaurant[0] })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: req.query.keyword })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})