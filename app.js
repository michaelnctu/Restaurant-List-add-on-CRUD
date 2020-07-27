const express = require('express')  //使用express
const app = express()
const exphbs = require('express-handlebars')  //handlebars
const port = 3000
const mongoose = require('mongoose')

const restList = require('./restaurant.json')

const Restaurant = require('./models/restaurant') // 載入 restaurant model

mongoose.connect('mongodb://localhost/Restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))



// ...
app.get('/', (req, res) => {
  // 取出 Restaurant model 裡的所有資料
  Restaurant.find()
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板 restaurants 是拿到的資料
    .catch(error => console.error(error)) // 錯誤處理
})

// routes setting

// app.get('/', (req, res) => {
//   res.render('index', { restaurants: restList.results })
// })

// app.get('/restaurants/:restaurant_id', (req, res) => {
//   const restaurant = restList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)
//   res.render('show', { restaurant: restaurant[0] })
// })

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const restaurants = restList.results.filter(restaurant => {
//     return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
//   })
//   res.render('index', { restaurants: restaurants, keyword: req.query.keyword })
// })

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})